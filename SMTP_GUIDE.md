# Supabase Custom SMTP Configuration Guide (Gmail)

This guide explains how to configure Gmail as a Custom SMTP provider for your Supabase project. This helps bypass the default Supabase mail rate limits (3 emails per hour) during testing and local development.

> [!IMPORTANT]
> Google does not allow using your standard account password for SMTP connections. You **must** generate an App Password to authenticate successfully.

---

## Step 1: Generate a Google App Password

1. Go to your **Google Account Settings**: [myaccount.google.com](https://myaccount.google.com/).
2. Navigate to the **Security** tab on the left.
3. Under *How you sign in to Google*, ensure **2-Step Verification** is turned **ON**.
4. In the search box at the top, type **App passwords** (or go directly to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)).
5. Enter a name for the app password (e.g., `Supabase Auth Email`) and click **Create**.
6. Copy the **16-character password** displayed in the yellow box (e.g., `abcd efgh ijkl mnop`). 
   *(Note: Copy it without spaces, as a single string of 16 characters like `abcdefghijklmnop`).*

---

## Step 2: Configure SMTP in Supabase

1. Open your project on the **[Supabase Console](https://supabase.com/dashboard)**.
2. In the sidebar, click on **Authentication** (the lock icon).
3. Select **Providers** (or **Settings** depending on the UI version) and expand the **Email** section.
4. Toggle **Enable Custom SMTP** to **ON**.
5. Fill in the fields with the following configurations:

| Field | Value / Setting | Description |
|---|---|---|
| **Sender email address** | `your-email@gmail.com` | The Gmail address emails will be sent from. |
| **Sender name** | `AI Email Generator` *(or your app name)* | The display name in the user's inbox. |
| **Host** | `smtp.gmail.com` | Google's SMTP hostname. |
| **Port number** | `587` | Port used for secure TLS connection. |
| **Minimum interval per user** | `60` | Wait time in seconds between emails to the same user. |
| **Username** | `your-email@gmail.com` | Your full Gmail address. |
| **Password** | `abcdefghijklmnop` | The 16-character Google **App Password** (without spaces). |

6. Click **Save** at the bottom of the page.

---

## Troubleshooting & Tips

### 1. Alternative: Bypass Email Verification Completely
For rapid local testing where email delivery is not required, you can disable email confirmation entirely:
1. In **Authentication** -> **Providers** -> **Email**.
2. Turn **Confirm email** to **OFF** (Disabled).
3. Click **Save**.
   *This automatically registers and logs in users immediately without sending confirmation emails, entirely bypassing any rate limits.*

### 2. Error: `Username and Password not accepted`
* Make sure **2-Step Verification** is active on your Google account.
* Double-check that you are using the **App Password** and *not* your primary Google account password.
* Ensure there are no spaces or extra characters in the password.

---

## Настройка Custom SMTP для Gmail (на русском)

Это руководство поможет вам настроить почтовый ящик Gmail для отправки писем подтверждения в проекте Supabase, чтобы обойти стандартный лимит Supabase (3 письма в час).

> [!IMPORTANT]
> Google не разрешает использовать обычный пароль от аккаунта для SMTP-подключений. Вам **обязательно** нужно сгенерировать Пароль приложения (App Password).

### Шаг 1: Создайте Пароль приложения в Google

1. Перейдите в настройки вашего Google аккаунта: [myaccount.google.com](https://myaccount.google.com/).
2. Перейдите в раздел **Безопасность (Security)**.
3. В подразделе *Вход в аккаунт Google* убедитесь, что включена **Двухэтапная аутентификация (2-Step Verification)**.
4. Введите в строке поиска настроек сверху **Пароли приложений (App Passwords)** или перейдите напрямую по ссылке: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
5. Введите название для пароля (например, `Supabase Auth Email`) и нажмите **Создать (Create)**.
6. Скопируйте **16-значный пароль**, который появится в желтом окне (например, `abcd efgh ijkl mnop`).
   *(Примечание: вставлять его в настройки нужно без пробелов, в виде одной строки: `abcdefghijklmnop`).*

---

### Шаг 2: Заполните настройки SMTP в панели Supabase

1. Откройте панель управления **[Supabase Console](https://supabase.com/dashboard)**.
2. В левом меню нажмите на иконку замка (**Authentication**).
3. Перейдите в раздел **Providers** и разверните вкладку **Email**.
4. Включите переключатель **Enable Custom SMTP** (перевести в положение ON).
5. Заполните поля следующими значениями:

* **Sender email address**: Ваш Gmail-адрес (например, `example@gmail.com`).
* **Sender name**: Любое имя отправителя (например, `AI Email Generator`).
* **Host**: `smtp.gmail.com`
* **Port number**: `587`
* **Minimum interval per user**: `60`
* **Username**: Ваш Gmail-адрес (например, `example@gmail.com`).
* **Password**: Скопированный **16-значный пароль приложения** (без пробелов).

6. Нажмите кнопку **Save** внизу страницы.

