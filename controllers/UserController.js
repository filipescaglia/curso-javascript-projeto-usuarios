class UserController{

    constructor(formId, tableId){
        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);
        this.onSubmit();
    }

    onSubmit(){
        this.formEl.addEventListener("submit", e=>{
            e.preventDefault();

            let btn = this.formEl.querySelector("[type=submit]");

            btn.disabled = true;

            let values = this.getValues();

            if(!values) return false;

            this.getPhoto().then(content=>{
                values.photo = content;

                this.addLine(values);

                this.formEl.reset();

                btn.disabled = false;

            }, e=>{
                console.error(e);
            });    
        });
    }

    getPhoto(){
        return new Promise((resolve, reject)=>{
            let fileReader = new FileReader();

            let elements = [...this.formEl.elements].filter(item=>{
                if (item.name === 'photo'){
                    return item;
                }
            });

            let file = elements[0].files[0];

            fileReader.onload = ()=>{
                resolve(fileReader.result);
            };

            fileReader.onerror = (e)=>{
                reject(e);
            };

            if (file){
                fileReader.readAsDataURL(file);
            } else{
                resolve('dist/img/boxed-bg.jpg');
            }
        });        
    }

    getValues(){

        let user = {};
        let isValid = true;

        [...this.formEl.elements].forEach(f=>{

            if (['name', 'email', 'password'].indexOf(f.name) > -1 && !f.value){
                f.parentElement.classList.add('has-error');
                isValid = false;
            }

            if(f.name == "gender"){
                if(f.checked){
                    user[f.name] = f.value;
                }
            } else if(f.name == "admin"){
                user[f.name] = f.checked;
            } else {
                user[f.name] = f.value;
            }
        });

        if(!isValid){
            return false;
        }
    
        return new User(user.name, user.gender, user.birth, user.country, user.email, user.password, user.photo, user.admin);
    }

    addLine(dataUser) {
        let tr = document.createElement("tr");

        tr.dataset.user = JSON.stringify(dataUser);

        tr.innerHTML = `
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? 'Sim' : 'Não'}</td>
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        `;

        this.tableEl.appendChild(tr);

        this.updateCount();
    }

    updateCount(){
        let numberUsers = 0;
        let numberAdmin = 0;

        [...this.tableEl.children].forEach(tr=>{
            numberUsers++;

            let user = JSON.parse(tr.dataset.user);

            if(user._admin) numberAdmin++;
        });

        document.querySelector("#number-users").innerHTML = numberUsers;
        document.querySelector("#number-users-admin").innerHTML = numberAdmin;
    }
}