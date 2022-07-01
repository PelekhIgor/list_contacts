class Contact{
    static url = 'contacts'
    #contacts = []
    #currentTodo = null
    #currentTodoE = null
    #contactContainerEl = null  // создаем контейнер куда сетим все контакты
    #editE = null
    #editName = null
    #editLastName = null
    #editPhone = null
    http = null


    #CLASSES = {
        showEdit:'show-edit',
        close: 'close',
        edit: 'edit_btn',
        todoList: 'contact_container'

    }
    constructor(el,editEl) {
        this.#contactContainerEl = el
        this.#editE = editEl
        this.init()

    }
    init(){
        this.http = new Http(Contact.url) // создаем экземпляр класса Http
        this.#editName = this.#editE.querySelector('.edit_name')
        this.#editLastName = this.#editE.querySelector('.edit_lastName')
        this.#editPhone = this.#editE.querySelector('.edit_phone')
        this.addListeners()
        this.getContacts()



    }
    addListeners(){
        document.querySelector('.create_btn')
            .addEventListener('click', () => // когда дойдет addEventListener в #API_URL слушать click, пойдет вызов стрелочной функции которая из себя вызовет метод createTodo.
                contact.createTodo(nameEl.value, lastNameEl.value, phoneEl.value))

        this.#contactContainerEl.addEventListener('click', this.onTodoClick)
        this.#editE
            .querySelector('.save_btn')
            .addEventListener('click', this.onSaveClick)
    }

    getContacts(){                  // отображать список контактов
        this.http.get().then(data => {
            this.#contacts = data
            this.renderContacts(this.#contacts)
        })
    }
    // нужно достать контейнер куда будем сетит все контакты
    renderContacts(contacts){
        this.#contactContainerEl.innerHTML = contacts
            .map((t) => this.createContactElement(t)) // используем map потому что на каждой итерации нужно изменять элемент который приходит
            .join('') // join - преобразует массив в строку

    }
    createContactElement(contact){
        return `<div class="item" id="${contact.id}">
            <div class="item_content">
                <div>
                    <div class="item_name">${contact.name}</div>
                    <div class="item_lastname">${contact.lastName}</div>
                    <div class="item_phone">${contact.phone}</div>
                </div>
                <div>${this.createDate(contact.createDate)}</div>
            </div>
            <div class="item_action">
                <div class="close">x</div>
                <button class="edit_btn">Edit</button>
            </div>
        </div>`
    }
    createDate(date){
        const newDate = moment(date).format('DD-MM-YYYY')
        return newDate
    }
    onTodoClick = (el) => {
        this.#currentTodoE = el.target.closest('.item')  //Метод Element.closest() возвращает ближайший родительский элемент (или сам элемент), который соответствует заданному CSS-селектору или null, если таковых элементов вообще нет.

        if(this.#currentTodoE){
            this.#currentTodo = this.#contacts.find((e) => e.id === this.#currentTodoE.id)
        }

        if (el.target.classList.contains(this.#CLASSES.close)){
            console.log('delete')
            this.removeTodo(this.#currentTodo.id)
            return
        }

        if (el.target.classList.contains(this.#CLASSES.edit)){
            console.log('edit')
            this.editTodo()
        }

    }
    removeTodo(id){
        this.http.delete(id).then(response =>{
                this.#contacts = this.#contacts.filter(t => t.id !== id) // возвращаем те контакты у которых id не равен id удаленных
                this.#currentTodoE.remove()
                this.clearData()
        })
    }
    clearData(){
        this.#currentTodoE = null
        this.#currentTodo = null
    }
    cleaning(){
        nameEl.value = ''
        lastNameEl.value = ''
        phoneEl.value = ''
    }

    editTodo(){
        this.#editE.classList.add(this.#CLASSES.showEdit)
        this.#editName.value = this.#currentTodo.name
        this.#editLastName.value = this.#currentTodo.lastName
        this.#editPhone.value = this.#currentTodo.phone



    }

    createTodo (name,lastName,phone){
        const contact = {
            name,
            lastName,
            phone,
        }
        this.http.create(contact).then(response =>{
            if(response && response.id){
                this.#contacts.unshift(response) //Метод unshift() добавляет один или более элементов в начало массива и возвращает новую длину массива.
                const content = this.createContactElement(response)
                this.#contactContainerEl.insertAdjacentHTML('afterbegin',content) // метод встаки строки с HTML тегами, сразу после открывающего тега
            }
        })
        this.cleaning()
    }


    onSaveClick = () => {
        this.#currentTodo.name = this.#editName.value
        this.#currentTodo.lastName = this.#editLastName.value
        this.#currentTodo.phone = this.#editPhone.value
        this.http.update(this.#currentTodo.id,this.#currentTodo)
            .then((r) => {
                if(r &&r.id){
                    this.#currentTodoE.querySelector('.item_name').innerHTML = r.name
                    this.#currentTodoE.querySelector('.item_lastname').innerHTML = r.lastName
                    this.#currentTodoE.querySelector('.item_phone').innerHTML = r.phone
                    this.#editE.classList.remove(this.#CLASSES.showEdit)
                    this.clearData()
                }
            })

    }

}