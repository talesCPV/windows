 


 
 /*  MENU  */ 
 function openMenu(){        
/*    
    const data = new URLSearchParams();        
        data.append("hash", localStorage.getItem('hash'));

    const myRequest = new Request("backend/openMenu.php",{
        method : "POST",
        body : data
    });

    const myPromisse = new Promise((resolve,reject) =>{
        fetch(myRequest)
        .then(function (response){
            if (response.status === 200) { 
                document.querySelector('#usr-name').innerHTML = localStorage.getItem('username').toUpperCase()
                resolve(response.text());                    
            } else { 
                reject(new Error("Houve algum erro na comunicação com o servidor"));                    
            } 
        });
    }); 

    myPromisse.then((resolve)=>{
        localStorage.setItem("menu",resolve);
        const menu_data = JSON.parse(resolve)
        const menu = document.querySelector('.menu')
        pushMenu(menu, menu_data)

    });
*/
    fetch('config/menu.json')
    .then((result)=>{
        result.text().then((txt)=>{
            localStorage.setItem("menu",txt);
            const menu_data = JSON.parse(txt)
            const menu = document.querySelector('.menu-iniciar')
            pushMenu(menu, menu_data.menu)
        })
    })


    function pushMenu(menu, obj){
        var drop = 1
        menu.innerHTML = ''
        for( let i=0; i<obj.length; i++){
            const li = document.createElement('li') 
            if(obj[i].class.trim().length>0){
                li.classList = obj[i].class
            }           
            const a = document.createElement('a')

            a.href = obj[i].script
            a.innerHTML = obj[i].modulo 
            if (obj[i].itens.length > 0 ){
                const lbl = document.createElement('label')
                lbl.htmlFor = `drop-${drop}`
                lbl.classList = 'toggle'
                lbl.innerHTML = obj[i].modulo + ' +'                  
                li.appendChild(lbl)

                li.appendChild(a)

                const ckb = document.createElement('input')
                ckb.type = 'checkbox';
                ckb.id = `drop-${drop}`
                drop++
                li.appendChild(ckb)

                if(obj[i].itens.length > 0){
                    const ul = document.createElement('ul')                       
                    pushMenu(ul,obj[i].itens)
                    li.appendChild(ul)
                }

            }else{
                li.appendChild(a)
            }

            menu.appendChild(li)
        }
    }
}


/*  MODAL  */

function closeModal(id='all'){
    const mod_main = document.querySelector('#myModal')
    if(id=='all'){
        while(mod_main.querySelectorAll('.modal').length > 0){
            mod_main.querySelectorAll('.modal')[0].remove()    
        }
    }else{
        id = (id=='')? mod_main.querySelectorAll('.modal').length-1 : id
        mod_main.querySelector('#modal-'+id).remove()
        delete main_data[id]
    }
    mod_main.style.display = (mod_main.querySelectorAll('.modal').length < 1) ? "none" : 'block'
}

function newModal(title, content, pos, id){

    const mod_main = document.querySelector('#myModal')
    const index = mod_main.querySelectorAll('.modal-content').length        
    const offset = 15

    const backModal = document.createElement('div')
        backModal.classList = 'modal'
        backModal.id = 'modal-'+id
        backModal.style.zIndex = 2+index
        backModal.style.display = 'block'

    const mod_card = document.createElement('div')
        mod_card.classList = 'modal-content'
        mod_card.id = 'card-'+id        
        mod_card.style.position = 'absolute'
        mod_card.style.zIndex = 3+index
        mod_card.style.margin = '0 auto'
        mod_card.style.top = pos[1] + index*offset+'px'
        mod_card.style.left = pos[0] + index*offset+'px'
        mod_card.style.right = pos[0] - index*offset+'px'
    
    const mod_title = document.createElement('div')
    mod_title.className = 'modal-title'    

    const p = document.createElement('p')
    p.innerHTML = title
    mod_title.appendChild(p)

    const span = document.createElement('span')
    span.classList = 'close'
    span.innerHTML = '&times;'
    span.addEventListener('click',()=>{
        closeModal(id)
    })
    mod_title.appendChild(span)
    mod_card.appendChild(mod_title)

    const mod_content = document.createElement('div')
    mod_content.classList = 'modal-text'
    mod_content.innerHTML = content
    mod_card.appendChild(mod_content)


    backModal.appendChild(mod_card)
    mod_main.appendChild(backModal)
    mod_main.style.display = "block"


}

async function openHTML(template,where="content-screen",label="", data="",pos=[30,30]){
    if(template.trim() != ""){
        const page_name = template.split('.')[0]
        return await new Promise((resolve,reject) =>{
            fetch( "templates/"+template)
            .then( stream => stream.text())
            .then( text => {
                const temp = document.createElement('div');
                temp.innerHTML = text;
                let body = temp.getElementsByTagName('template')[0];
                let script = temp.getElementsByTagName('script')[0];

                if(body == undefined){
                    script = ''
                    body = document.createElement('div')
                    body.innerHTML = '<style>p{text-align : center;}</style> <p>Desculpe, este módulo ainda não foi implementado</p>'
                    body.style.color = '#FFFF00 !important'
                    where = 'pop-up'
                    label = 'ERRO 404!'
                }

                if(where == "pop-up"){
                    newModal(label,body.innerHTML,pos,page_name)
                }else{
                    const cont = body.innerHTML.replace('<h1>', `<span id="close-screen" onclick="document.querySelector('#imgLogo').click()">&times;</span><h1>`)
                    
//                    const close = where == 'content-screen' ? `<div id="close-screen"><span onclick="document.querySelector('#imgLogo').click()">&times;</span></div>` : ''
                    document.getElementById(where).innerHTML = cont;                    
                }

                main_data[page_name] = new Object
                main_data[page_name].data = data

                eval(script.innerHTML);
                resolve = body
                document.querySelector('#drop').checked = false // close menu
            }); 
        }); 
    }
}
