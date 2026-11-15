<?php
/**
 * nekoyashiki お問い合わせフォームの送信処理（エックスサーバー用）
 *
 * - 事業者あてに内容を送り、お客様には受付の自動返信を送ります。
 * - JavaScript から送られた場合は JSON を返し、それ以外は完了ページへ移動します。
 * - 宛先や文面を変えるときは、下の設定だけを書き換えてください。
 */

// ===== 設定 =====
const MAIL_TO     = 'yukky@nekoyashiki.life';   // 届け先
const MAIL_FROM   = 'yukky@nekoyashiki.life';   // 差出人（このドメインのアドレスにしてください）
const FROM_NAME   = 'nekoyashiki';
const SITE_HOSTS  = ['nekoyashiki.life', 'www.nekoyashiki.life'];
const THANKS_URL  = '/contact/thanks/';
const ERROR_URL   = '/contact/?error=1';
const RATE_LIMIT  = 5;     // 同じ接続元から
const RATE_WINDOW = 600;   // この秒数のあいだに送れる回数
const SIGNATURE   = <<<TXT
──────────────────
nekoyashiki（ねこやしき）
代表 齋藤 幸永
〒980-0822 宮城県仙台市青葉区立町10-1
TEL 080-2815-3758（平日 9:00〜19:00）
https://nekoyashiki.life/
──────────────────
TXT;
// ================

mb_language('uni');  // UTF-8 で送る（機種依存文字も文字化けしない）
date_default_timezone_set('Asia/Tokyo');
mb_internal_encoding('UTF-8');
header('X-Content-Type-Options: nosniff');

$wantsJson = stripos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false;

function finish(bool $ok, int $status = 200, string $message = ''): void {
    global $wantsJson;
    if ($wantsJson) {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $ok, 'message' => $message], JSON_UNESCAPED_UNICODE);
    } else {
        header('Location: ' . ($ok ? THANKS_URL : ERROR_URL), true, 303);
    }
    exit;
}

/** 1行の項目：改行や制御文字を取り除く（メールヘッダーへの差し込み対策） */
function line(string $key, int $max = 200): string {
    $v = (string)($_POST[$key] ?? '');
    $v = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $v) ?? '';
    return mb_substr(trim($v), 0, $max);
}

/** 複数行の項目 */
function text(string $key, int $max = 5000): string {
    $v = str_replace(["\r\n", "\r"], "\n", (string)($_POST[$key] ?? ''));
    $v = preg_replace('/[\x00-\x08\x0B-\x1F\x7F]+/u', '', $v) ?? '';
    return mb_substr(trim($v), 0, $max);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Location: /contact/', true, 303);
    exit;
}

// ほかのサイトから送られたものは受け付けない
$origin = $_SERVER['HTTP_ORIGIN'] ?? ($_SERVER['HTTP_REFERER'] ?? '');
if ($origin !== '') {
    $host = strtolower((string)parse_url($origin, PHP_URL_HOST));
    if (!in_array($host, SITE_HOSTS, true)) finish(false, 403, '送信元を確認できませんでした。');
}

// ロボット対策（人には見えない欄に入力があれば、送ったふりをして終える）
if (line('_gotcha') !== '') finish(true);

// 連続送信の制限
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateFile = sys_get_temp_dir() . '/nk_contact_' . hash('sha256', $ip);
$now = time();
$hits = array_filter(
    is_file($rateFile) ? array_map('intval', explode(',', (string)file_get_contents($rateFile))) : [],
    fn($t) => $t > $now - RATE_WINDOW
);
if (count($hits) >= RATE_LIMIT) finish(false, 429, '短い時間に何度も送信されたため、受け付けを止めています。時間をおいて、またはお電話でご連絡ください。');

// 入力の確認
$types = ['事業者様のご相談', '個人様のご依頼', '採用について', 'そのほか'];
$type    = line('type', 40);
$name    = line('name', 100);
$company = line('company', 100);
$email   = line('email', 254);
$tel     = line('tel', 30);
$message = text('message');
$consent = line('consent', 10);

$errors = [];
if (!in_array($type, $types, true)) $errors[] = 'お問い合わせの種類';
if ($name === '') $errors[] = 'お名前';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'メールアドレス';
if ($tel !== '' && !preg_match('/^[0-9０-９+＋()（）\-－ー‐ ]{6,30}$/u', $tel)) $errors[] = '電話番号';
if ($message === '') $errors[] = 'ご相談の内容';
if ($consent !== '同意する') $errors[] = 'プライバシーポリシーへの同意';
if ($errors) finish(false, 422, '次の項目をご確認ください：' . implode('、', $errors));

$hits[] = $now;
@file_put_contents($rateFile, implode(',', $hits), LOCK_EX);

// 本文（空欄は「未入力」と表示）
$companyText = $company !== '' ? $company : '（未入力）';
$telText = $tel !== '' ? $tel : '（未入力）';
$date = date('Y年n月j日 H:i');
$body = <<<TXT
【お問い合わせの種類】
{$type}

【お名前】
{$name}

【会社名・屋号】
{$companyText}

【メールアドレス】
{$email}

【電話番号】
{$telText}

【ご相談の内容】
{$message}
TXT;

$from = mb_encode_mimeheader(FROM_NAME) . ' <' . MAIL_FROM . '>';
$params = '-f' . MAIL_FROM;

// 1. 事業者あて（返信するとお客様に届くよう Reply-To を設定）
$adminSubject = "【HPお問い合わせ】{$type}／{$name} 様";
$adminBody = "ホームページのお問い合わせフォームから送信がありました。\n受付日時：{$date}\n\n{$body}\n\n――\n送信元IP：{$ip}\n";
$adminHeaders = "From: {$from}\r\nReply-To: {$email}";
$sent = mb_send_mail(MAIL_TO, $adminSubject, $adminBody, $adminHeaders, $params);

if (!$sent) finish(false, 500, '送信できませんでした。お手数ですが、お電話かメールでご連絡ください。');

// 2. お客様あての自動返信
$replySubject = '【nekoyashiki】お問い合わせを受け付けました';
$replyBody = <<<TXT
{$name} 様

nekoyashiki（ねこやしき）にお問い合わせいただき、ありがとうございます。
以下の内容で受け付けました。内容を確認して、担当より折り返しご連絡します。

※このメールは自動でお送りしています。
※お心当たりがない場合は、お手数ですがこのメールを破棄してください。

{$body}

{SIGNATURE}
TXT;
$replyBody = str_replace('{SIGNATURE}', SIGNATURE, $replyBody);
mb_send_mail($email, $replySubject, $replyBody, "From: {$from}", $params);

finish(true);
