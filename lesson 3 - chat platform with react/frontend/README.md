<div align="center">
    <img src="https://badges.aleen42.com/src/javascript.svg">
    <img src="https://badges.aleen42.com/src/html5.svg">
    <img src="https://badges.aleen42.com/src/css3.svg">
    <img src="https://img.shields.io/github/license/Sobhan-SRZA/Portfolio?label=License">
    <img src="https://img.shields.io/github/last-commit/Sobhan-SRZA/Portfolio?label=Last Commit">
    <img src="https://img.shields.io/github/languages/code-size/Sobhan-SRZA/Portfolio?label=Code Size">
    <img src="https://img.shields.io/github/directory-file-count/Sobhan-SRZA/Portfolio?label=Files">
    <div>
        <img src="https://img.shields.io/github/forks/Sobhan-SRZA/Portfolio?label=Forks">
        <img src="https://img.shields.io/github/stars/Sobhan-SRZA/Portfolio?label=Stars">
        <img src="https://img.shields.io/github/watchers/Sobhan-SRZA/Portfolio?label=Watchers">
    </div>
    <div>
        <img style="display:block;margin-left:auto;margin-right:auto;width:30%;" src="https://github-readme-stats.vercel.app/api/pin/?username=Sobhan-SRZA&repo=Portfolio&theme=react">
    </div>
</div>

---

# مستند پروژه پرتفولیو

## معرفی پروژه

پروژه پرتفولیو یک وب‌سایت شخصی برای نمایش مهارت‌ها، پروژه‌ها، بیوگرافی و اطلاعات تماس سبحان رسول‌زاده اصل (معروف به Mr. Sinre یا Sobhan-SRZA) است. این وب‌سایت با استفاده از فناوری‌های مدرن وب مانند React.js، TypeScript و Tailwind CSS توسعه یافته و از قابلیت چندزبانه (فارسی و انگلیسی) پشتیبانی می‌کند. هدف اصلی این پروژه، ارائه یک پلتفرم حرفه‌ای برای معرفی دستاوردها، پروژه‌های متن‌باز، و ارتباط با مخاطبان از طریق فرم تماس و شبکه‌های اجتماعی است.

## تکنولوژی‌های استفاده‌شده

پروژه از مجموعه‌ای از فناوری‌های مدرن برای توسعه و استقرار استفاده می‌کند که در فایل `package.json` مشخص شده‌اند. در زیر لیستی از این تکنولوژی‌ها و نقش آنها آورده شده است:

### وابستگی‌های اصلی

- **React (^19.1.0)**: کتابخانه اصلی برای ساخت رابط کاربری تعاملی.
- **React DOM (^19.1.0)**: برای رندر کردن کامپوننت‌های React در مرورگر.
- **React Router DOM (^7.8.2)**: برای مدیریت مسیریابی سمت کلاینت در برنامه.
- **React Helmet (^6.1.0)**: برای مدیریت متا تگ‌ها و بهبود سئو (SEO).
- **i18next (^25.4.2) و react-i18next (^15.7.1)**: برای پشتیبانی از چندزبانگی (فارسی و انگلیسی).
- **Headless UI (^2.2.7)**: برای ایجاد کامپوننت‌های رابط کاربری بدون استایل پیش‌فرض (مانند منوها و دیالوگ‌ها).
- **Heroicons (^2.2.0)**: آیکون‌های وکتور برای رابط کاربری (مانند منوی همبرگری).
- **Lucide React (^0.541.0)**: آیکون‌های اضافی برای شبکه‌های اجتماعی و دکمه‌ها.
- **Tailwind CSS (^4.1.12) و @tailwindcss/vite (^4.1.12)**: برای استایل‌دهی سریع و پاسخ‌گو با استفاده از رویکرد utility-first.

### وابستگی‌های توسعه

- **TypeScript (\~5.8.3)**: برای افزودن تایپینگ استاتیک به کد JavaScript.
- **Vite (^6.3.5)**: ابزارビルد سریع برای توسعه و باندل پروژه.
- **ESLint (^9.25.0)** و پلاگین‌های مرتبط: برای بررسی و بهبود کیفیت کد.
- **@vitejs/plugin-react (^4.4.1)**: پلاگین Vite برای پشتیبانی از React.
- **typescript-eslint (^8.30.1)**: برای بررسی کد TypeScript با ESLint.

### اسکریپت‌ها

- `dev`: اجرای پروژه در حالت توسعه با Vite.
- `build`: کامپایل پروژه با TypeScript و باندل با Vite.
- `preview`: پیش‌نمایش پروژه ساخته‌شده.
- `predeploy` و `deploy`: برای باندل و استقرار پروژه روی GitHub Pages.

## ساختار پروژه

پروژه شامل فایل‌های اصلی زیر است که هر کدام نقش خاصی در عملکرد وب‌سایت دارند:

### 1. **src/components/Header.tsx**

کامپوننت هدر، نوار وب‌سایت را ارائه می‌دهد که شامل لوگو، لینک‌های ناوبری، سوئیچ زبان، و دکمه تغییر تم است. این کامپوننت برای نمایش در دسکتاپ و موبایل پاسخ‌گو است.

- **ویژگی‌ها**:

  - نمایش لوگو (Sobhan-SRZA / Mr. Sinre) با لینک به صفحه اصلی.
  - منوی ناوبری با لینک‌های Home، Projects، Contact، Biography، و Social.
  - منوی همبرگری برای نمایش در موبایل با استفاده از `Dialog` از Headless UI.
  - پشتیبانی از چندزبانگی با تغییر جهت متن (RTL برای فارسی، LTR برای انگلیسی).
  - ادغام با `LanguageSwitcher` و `ThemeToggle`.

- **توابع و متدها**:

  - `useState` برای مدیریت حالت منوی موبایل (`mobileMenuOpen`).
  - `useTranslation` برای دسترسی به ترجمه‌ها.
  - استفاده از `NavLink` از react-router-dom برای مسیریابی.
  - اعمال استایل‌های شرطی برای لینک‌های فعال.

- **نحوه استفاده**: این کامپوننت در تمام صفحات به‌عنوان هدر اصلی استفاده می‌شود و نیازی به ارسال props ندارد.

### 2. **src/components/Footer.tsx**

کامپوننت فوتر، بخش پایینی وب‌سایت را تشکیل می‌دهد که شامل لوگو، لینک‌های مفید، لینک‌های شبکه‌های اجتماعی، و کپی‌رایت است.

- **ویژگی‌ها**:

  - نمایش لوگو با لینک به صفحه اصلی.
  - لینک‌های مفید (Home، Projects، Contact) با ترجمه.
  - لینک‌های شبکه‌های اجتماعی (GitHub، LinkedIn، Telegram، Instagram) با آیکون‌های Lucide.
  - کپی‌رایت پویا با سال‌های شمسی (برای فارسی) و میلادی (برای انگلیسی).
  - طراحی پاسخ‌گو با استفاده از گرید Tailwind CSS.

- **توابع و متدها**:

  - `useTranslation` برای دسترسی به ترجمه‌های فوتر.
  - استفاده از `NavLink` برای لینک‌های داخلی و `<a>` برای لینک‌های خارجی.
  - استفاده از متغیرهای CSS برای تم‌سازی.

- **نحوه استفاده**: این کامپوننت در تمام صفحات به‌عنوان فوتر اصلی استفاده می‌شود.

### 3. **src/components/LanguageSwitcher.tsx**

کامپوننت برای تغییر زبان وب‌سایت بین فارسی و انگلیسی با استفاده از یک منوی کشویی.

- **ویژگی‌ها**:

  - نمایش زبان فعلی (English یا فارسی) در دکمه.
  - منوی کشویی با استفاده از `Popover` از Headless UI.
  - به‌روزرسانی زبان، جهت متن (RTL/LTR)، و ذخیره در localStorage.
  - پشتیبانی از callback اختیاری (`onChange`) برای واکنش به تغییر زبان.

- **توابع و متدها**:

  - `useTranslation` برای دسترسی به i18n.
  - `handleLanguageChange`: تابع برای تغییر زبان، به‌روزرسانی `lang` و `dir` در document، و ذخیره در localStorage.
  - آرایه `languages` برای تعریف زبان‌های پشتیبانی‌شده.

- **نحوه استفاده**: این کامپوننت در `Header` و منوی موبایل استفاده می‌شود. می‌توان یک callback اختیاری برای واکنش به تغییر زبان ارسال کرد.

### 4. **src/components/ThemeToggle.tsx**

کامپوننت برای تغییر تم وب‌سایت بین حالت روشن و تاریک.

- **ویژگی‌ها**:

  - تشخیص تم اولیه بر اساس تنظیمات سیستم کاربر یا localStorage.
  - تغییر تم با کلیک روی دکمه (نمایش آیکون Sun یا Moon از Lucide).
  - ذخیره تم در localStorage برای پایداری.
  - پشتیبانی از callback اختیاری (`onChange`) برای واکنش به تغییر تم.

- **توابع و متدها**:

  - `useState` برای مدیریت حالت تم (`isDark`).
  - `useEffect` برای تنظیم تم اولیه بر اساس `prefers-color-scheme` یا localStorage.
  - `toggleTheme`: تابع برای تغییر تم و به‌روزرسانی document و localStorage.

- **نحوه استفاده**: این کامپوننت در `Header` و منوی موبایل استفاده می‌شود.

### 5. **src/components/Contact.tsx**

کامپوننت صفحه تماس، شامل فرم ارسال پیام و لینک‌های شبکه‌های اجتماعی.

- **ویژگی‌ها**:

  - فرم تماس با اعتبارسنجی سمت کلاینت (نام، ایمیل، پیام).
  - ارسال داده‌های فرم به Google Apps Script با استفاده از fetch.
  - نمایش دیالوگ‌های موفقیت، خطا، یا در حال ارسال با `Dialog` از Headless UI.
  - نمایش لینک‌های شبکه‌های اجتماعی با آیکون‌های Lucide.
  - پشتیبانی از SEO با `Helmet`.
  - پاسخ‌گویی و تغییر جهت متن بر اساس زبان.

- **توابع و متدها**:

  - `useState` برای مدیریت حالت‌های loading و alert.
  - `validateForm`: اعتبارسنجی ورودی‌های فرم (نام حداقل 3 کاراکتر، ایمیل معتبر، پیام حداقل 5 کاراکتر).
  - `handleSubmit`: مدیریت ارسال فرم و نمایش دیالوگ‌های مربوطه.
  - آرایه `contacts` برای لینک‌های شبکه‌های اجتماعی.

- **نحوه استفاده**: این کامپوننت به‌عنوان یک صفحه مستقل در مسیر `/contact` استفاده می‌شود.

### 6. **src/pages/Biography.tsx**

کامپوننت صفحه بیوگرافی، شامل خط زمانی زندگی و پروژه‌های فعال.

- **ویژگی‌ها**:

  - نمایش معرفی کوتاه و خط زمانی با استفاده از ترجمه‌ها.
  - لیست پروژه‌های فعال (HyCom، Ticker Boy، DJ BOY، Padio).
  - لینک‌های ناوبری به صفحات پروژه‌ها و تماس.
  - پشتیبانی از SEO با `Helmet`.
  - طراحی پاسخ‌گو با گرید Tailwind CSS.

- **توابع و متدها**:

  - `useTranslation` برای دسترسی به ترجمه‌ها.
  - `extractNumbers`: استخراج سال‌ها از رشته‌های ترجمه‌شده برای خط زمانی.
  - آرایه `timeline` برای تعریف رویدادهای بیوگرافی.

- **نحوه استفاده**: این کامپوننت به‌عنوان یک صفحه مستقل در مسیر `/biography` استفاده می‌شود.

### 7. **src/components/SeoSection.tsx**

کامپوننت برای بهبود سئو با ارائه محتوای مخفی و متا تگ‌های چندزبانه.

- **ویژگی‌ها**:

  - ارائه متا تگ‌های description در فارسی و انگلیسی با `Helmet`.
  - محتوای مخفی (با `display: none`) برای ایندکس شدن توسط موتورهای جستجو.
  - شامل بیوگرافی، مهارت‌ها، پروژه‌ها، شبکه‌های اجتماعی، و هشتگ‌ها.

- **نحوه استفاده**: این کامپوننت در تمام صفحات برای بهبود سئو استفاده می‌شود.

### 8. **src/storage.ts**

فایل برای ذخیره لینک‌های شبکه‌های اجتماعی و اطلاعات تماس به‌صورت متمرکز.

- **ویژگی‌ها**:

  - شیء `social` شامل لینک‌های ایمیل، شبکه‌های اجتماعی (GitHub، LinkedIn، Telegram، و غیره)، و وب‌سایت‌ها.
  - استفاده از `as const` برای تضمین تایپینگ دقیق در TypeScript.

- **نحوه استفاده**: این فایل در کامپوننت‌های `Contact.tsx`، `Footer.tsx`، و `SeoSection.tsx` برای دسترسی به لینک‌ها استفاده می‌شود.

### 9. **src/i18n/index.ts**

فایل تنظیمات i18next برای پشتیبانی از چندزبانگی.

- **ویژگی‌ها**:

  - بارگذاری فایل‌های ترجمه (en.json و fa.json).
  - تنظیم زبان پیش‌فرض (انگلیسی) و زبان جایگزین.
  - غیرفعال کردن escape برای جلوگیری از مشکلات XSS (React به‌طور خودکار این کار را انجام می‌دهد).

- **نحوه استفاده**: این فایل در تمام کامپوننت‌هایی که نیاز به ترجمه دارند (مانند `Header`، `Footer`، `Contact`) استفاده می‌شود.

### 10. **src/i18n/en.json**

فایل ترجمه انگلیسی شامل کلیدهای متنی برای تمام بخش‌های وب‌سایت.

- **ویژگی‌ها**:

  - ترجمه‌های مربوط به ناوبری، بیوگرافی، پروژه‌ها، تماس، و فوتر.
  - ساختار سلسله‌مراتبی برای سازمان‌دهی بهتر (مانند `biography_timeline`، `projects_list`).

- **نحوه استفاده**: این فایل توسط i18next برای ارائه ترجمه‌های انگلیسی استفاده می‌شود.

## نحوه اجرا و استقرار

1. **نصب وابستگی‌ها**:

   ```bash
   npm install
   ```

2. **اجرای پروژه در حالت توسعه**:

   ```bash
   npm run dev
   ```

3. **ساخت پروژه**:

   ```bash
   npm run build
   ```

4. **پیش‌نمایش پروژه ساخته‌شده**:

   ```bash
   npm run preview
   ```

5. **استقرار روی GitHub Pages**:

   ```bash
   npm run deploy
   ```

## ویژگی‌های کلیدی پروژه

- **پاسخ‌گویی**: طراحی کاملاً پاسخ‌گو با استفاده از Tailwind CSS.
- **چندزبانگی**: پشتیبانی از فارسی و انگلیسی با تغییر جهت متن (RTL/LTR).
- **تم‌سازی**: پشتیبانی از تم‌های روشن و تاریک با استفاده از متغیرهای CSS.
- **سئو**: بهبود ایندکس شدن توسط موتورهای جستجو با `Helmet` و محتوای مخفی.
- **دسترسی‌پذیری**: استفاده از `aria-label` و نقش‌های ARIA برای پشتیبانی از screen readerها.
- **عملکرد**: استفاده از Vite برای باندل سریع و بهینه.

## نکات توسعه

- **بهبود کلیدهای منحصربه‌فرد**: در کامپوننت‌هایی مانند `Contact.tsx`، `Biography.tsx`، و `Footer.tsx`، بهتر است به‌جای استفاده از ایندکس به‌عنوان `key`، از مقادیر منحصربه‌فرد مانند URL یا نام استفاده شود.
- **مدیریت خطاها**: در `Contact.tsx`، می‌توان مدیریت خطاهای پیشرفته‌تری برای API اضافه کرد.
- **گسترش زبان‌ها**: فایل‌های ترجمه بیشتری می‌توانند به i18next اضافه شوند تا زبان‌های بیشتری پشتیبانی شوند.
- **تست**: اضافه کردن تست‌های واحد با استفاده از ابزارهایی مانند Jest یا Vitest برای اطمینان از پایداری کد.

## نتیجه‌گیری

این پروژه یک پرتفولیوی حرفه‌ای و مدرن است که با استفاده از فناوری‌های پیشرفته ساخته شده و قابلیت‌های چندزبانه، پاسخ‌گویی، و سئو را ارائه می‌دهد. ساختار modular و استفاده از TypeScript امکان توسعه و نگهداری آسان را فراهم می‌کند. این وب‌سایت نه‌تنها دستاوردهای حرفه‌ای سبحان رسول‌زاده اصل را به نمایش می‌گذارد، بلکه نمونه‌ای عالی از توسعه وب مدرن است.

---

## Contact
<div align="center">
  <a href="https://srza.ir" target="_blank">
   <img align="left" src="https://raw.githubusercontent.com/Sobhan-SRZA/Sobhan-SRZA/refs/heads/main/images/social.png" alt="Sobhan-SRZA social" width=400px>
  </a>

  <a href="https://t.me/d_opa_mine" target="_blank">
   <img alt="Telegram"
    src="https://raw.githubusercontent.com/Sobhan-SRZA/Sobhan-SRZA/refs/heads/main/images/telegram-ch.svg"
    height="30" />
  </a>

  <a href="https://t.me/Sobhan_SRZA" target="_blank">
   <img alt="Telegram"
    src="https://raw.githubusercontent.com/Sobhan-SRZA/Sobhan-SRZA/refs/heads/main/images/telegram-ac.svg"
    height="30" />
  </a>

  <a href="https://www.instagram.com/mr.sinre?igsh=cWk1aHdhaGRnOGg%3D&utm_source=qr" target="_blank">
   <img alt="Instagram"
    src="https://raw.githubusercontent.com/Sobhan-SRZA/Sobhan-SRZA/refs/heads/main/images/instagram.svg"
    height="30" />
  </a>

  <a href="https://www.twitch.tv/sobhan_srza" target="_blank">
   <img alt="Twitch"
    src="https://raw.githubusercontent.com/Sobhan-SRZA/Sobhan-SRZA/refs/heads/main/images/twitch.svg"
    height="30" />
  </a>

  <a href="https://www.youtube.com/@mr_sinre?app=desktop&sub_confirmation=1" target="_blank">
   <img alt="YouTube"
    src="https://raw.githubusercontent.com/Sobhan-SRZA/Sobhan-SRZA/refs/heads/main/images/youtube.svg"
    height="30" />
  </a>
  
  <a href="https://github.com/Sobhan-SRZA" target="_blank">
   <img alt="Github"
    src="https://raw.githubusercontent.com/Sobhan-SRZA/Sobhan-SRZA/refs/heads/main/images/github.svg"
    height="30" />
  </a>
  
  <p align="left">
   <a href="https://discord.gg/xh2S2h67UW" target="_blank">
    <img src="https://discord.com/api/guilds/1054814674979409940/widget.png?style=banner2" alt="pc-development.png">
   </a>
  </p>

  <p align="right">
   <a href="https://discord.gg/54zDNTAymF" target="_blank">
    <img src="https://discord.com/api/guilds/1181764925874507836/widget.png?style=banner2" alt="pc-club.png">
   </a>
  </p>

  <div align="center">
   <a href="https://discord.com/users/865630940361785345" target="_blank">
    <img alt="My Discord Account" src="https://discord.c99.nl/widget/theme-1/865630940361785345.png" />
   </a>
    <a href="https://discord.com/users/986314682547716117" target="_blank" align="right">
    <img alt="Team Discord Account" src="https://discord.c99.nl/widget/theme-1/986314682547716117.png" />
   </a>
  </div>

 </div>

</div>
