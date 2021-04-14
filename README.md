##Znak database

https://znakdb.web.app

TODO
---------------
- [x] Персистентное хранение состояние Big Card в localStorage
- [ ] Transition groups для карточек
- [x] Асинхронная загрузка картинок
- [x] Loader для картинок с процентами
- [ ] Loader должен переставать мигать после окончания загрузки.
- [ ] После аплоада уведомлять юзера, что все окей 
- [x] Хранить связь со storage через id записи, а не url
- [ ] ~~Итерировать карточки без бинда; Нужно получать данные из очереди и мапить их в объект. Затем объеденять два запроса~~
- [x] Нажатие мышкой Delete удаляет сразу несколько объектов, если при удалении одного кнопка Delete соседнего объекта попадает под курсор.
- [x] Генерация превью на клиенте и хранение этого превью на стораже вместе с pdf 
- [ ] Избавиться от jquery в 404 (перейти на Unsplash?)
- [ ] Удалять background при переходе из 404 на другую страницу
- [ ] Динамическая подгрузка с https://akryum.github.io/vue-virtual-scroller/
- [ ] Имя файла при аплоаде - делать уникальным ИЛИ говорить юзеру, что такой файл уже есть
- [x] Delete method must delete jpeg also  
- [x] Имена файлов jpg-ов сделать по id родительской записи. Так убиваем сразу двух зайцев - не нужно валидировать имя файл плюс знаем, кто родитель картинки.
- [ ] В мини-версии сделать всплаваюшую инфу
- [ ] При вводе тегов сделать подсказки из уже существующих тегов
- [x] Читать метаданные (description, tags) из pdf и писать их в базу
- [ ] После аплоаде делать state кнопки Upload - disabled, и возращать ее после изменения fileList
- [ ] Имеет ли смысл хранить токен в базе данных, чтобы осуществлять доступ к картинке, не отбрасывая токен?
- [x] Если много файлов, их имена не вмещаются в dropdown area 
- [ ] Поиск должен быть no case sensitive
- [x] Отдельная тестовая база для dev, отдельная для prod
- [ ] Сделать редактирование в модальном окне для мини версии
- [ ] FEATURE Хранить под одним знаком несколько начертаний, белый на белом, белый на черном и т.д.
- [ ] Попробовать расположение bootstrap's cards "в столбец"
- [ ] Сделать layout в три колонки - значок, имя, описание (им можно теги, и кнопки управления)
- [ ] Сделать облако тегов, оно же Группы значков будет
- [ ] Не удаляются теги в режиме полного просмотра, хотя крестик есть.
- [x] При аплоаде, если закинуто много файлов, их имена наползают на кнопки Upload Reset
- [ ] В режиме small view, нужно скачиват по клику на картинку
- [ ] Сделать переключатель на три состояние - Big, Small, List
- [ ] В режиме без логина можно просматривать и скачивать
- [ ] Режим по умолчанию - small view
- [ ] Сделать фильтр "залитые за последний час" ИЛИ сортировку по дате загрузки, чтобы было удобно найти и обработать новые загрузки
- [ ] Сделать теги более компактными, без рамки
- [ ] Сделать обрезание названия в Big View, по кол-ву символов
- [ ] Можно сделать такой life quality - название папки, из которой заливаются картинки, использовать как тег. Так удобно назначить тег все залитым картинкам.  