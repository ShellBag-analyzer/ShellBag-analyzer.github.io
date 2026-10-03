# ShellBag Analyzer — сайт на GitHub Pages

Готовый статический сайт под ShellBags. Сборка и серверная часть не требуются.

## Публикация

1. Загрузите содержимое папки в корень `ShellBag-analyzer/ShellBag-analyzer.github.io`, в ветку `main`, включая `.nojekyll`. Загружайте файлы, а не папку целиком.
2. В **Settings → Pages → Build and deployment** выберите **Deploy from a branch → main → /(root)** и нажмите **Save**.
3. Дождитесь успешного задания Pages в **Actions**. Сайт: https://shellbag-analyzer.github.io/ . Проверьте HTTPS, кнопки, фильтры, подробности и CSV.

Документация GitHub: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Ссылки

- Скачивание: https://github.com/ShellBag-analyzer/ShellBag-analyzer.github.io/releases/download/ShellBag/ShellBag.exe
- GitHub: https://github.com/ShellBag-analyzer/ShellBag-analyzer.github.io/releases/tag/ShellBag

## Состав

`index.html`, `style.css`, `shellbag.css`, `script.js` — страница, оформление и интерактивный пример.
`manrope-*.woff2` — локальные шрифты.
`favicon.svg`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `manifest.webmanifest`, `og.png` — иконки и социальное превью.
`robots.txt`, `sitemap.xml`, `404.html`, `.nojekyll` — индексация и GitHub Pages.
Все файлы нужно загрузить вместе. README служит инструкцией и не требуется для отображения страницы.
Для локального просмотра используйте HTTP-сервер, например `python -m http.server 8000` в папке сайта.

## Что представляет демонстрация

Учебный пример ShellBags с вымышленными путями, источниками реестра, NodeSlot, MRU и метками времени. Он не читает реестр компьютера и не отправляет пользовательские данные. CSV экспортирует только демонстрационные записи. Это объяснение структуры артефактов, а не снимок интерфейса ShellBag.exe и не заявление о неподтверждённых функциях программы.

LastWrite относится к изменению ключа реестра. Метки времени Shell Item относятся к объекту папки. MRU описывает порядок в одной ветви. Само наличие записи не доказывает чтение файла, удаление папки или точное время посещения. Категория «внешний носитель» задана в учебных данных, а не определена по одной букве диска.

Описание публичного релиза не указывает версию, лицензию, набор функций экспорта или системные требования. Поэтому сайт не обещает MIT, open source, конкретную версию Windows или неподтверждённые возможности EXE.

## Источники для темы

- Описание релиза: https://github.com/ShellBag-analyzer/ShellBag-analyzer.github.io/releases/tag/ShellBag
- Парсер ShellBags проекта Volatility: https://github.com/volatilityfoundation/volatility/blob/master/volatility/plugins/registry/shellbags.py
- Формат Shell Item, включая метки времени и сетевые объекты: https://github.com/libyal/libfwsi/blob/main/documentation/Windows%20Shell%20Item%20format.asciidoc
- Различия Parent / Current Bag и условия интерпретации времени взаимодействия: https://github.com/EricZimmerman/Issues/issues/22
- Соответствие файлов реестра пользовательским ветвям: https://github.com/libyal/winreg-kb/blob/main/docs/sources/windows-registry/Files.md

## После публикации

Подтвердите владение в Google Search Console и Яндекс Вебмастере, отправьте https://shellbag-analyzer.github.io/sitemap.xml и проверьте индексацию главной. Добавьте реальные снимки приложения и подтверждённую инструкцию по работе со сборкой. SEO не гарантирует первое место: https://developers.google.com/search/docs/fundamentals/seo-starter-guide

Canonical, Open Graph, Twitter Card, описание и SoftwareApplication настроены на новый домен. При смене домена обновите index.html, robots.txt и sitemap.xml. Основные тексты и скачивание работают без JavaScript.
