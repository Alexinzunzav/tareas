
//LLamar a los elementos del html

const inputTarea = document.getElementById('input-tarea');
const btnAgregar = document.getElementById('agregar-tarea');
const listaTareas = document.getElementById('lista-tareas');
const contadorTareas = document.getElementById('contador-tareas');
const fecha = document.getElementById('fecha');

//se setea valor inicial de numero de tareas
let numTareas = 0;

//se crea el arr donde se almacenaran las tareas
const tareas = [];

//se crea la matriz de obj de las tareas
class objTarea {
    constructor(tarea, completada = false) {
      this.tarea = tarea;
      this.completada = completada;
    }
}

// Función principal que agrega la tarea ingresada a la lista
const agregarTarea = () => {

    //Leer valor del input donde se ingresan las tareas
    let inputValue = inputTarea.value;
    
    //Si se ingresó una tarea en el input...
    if (inputValue != ''){
        
        //se crea una instacia de la clase Tarea
        const nuevoObjTarea = new objTarea(inputValue);
        tareas.push(nuevoObjTarea);

        /* Se crea un list item con el valor del input y se agrega a la lista  */

        // Se crear el li con su clase y luego se agrega a la lista
        const liTarea = document.createElement('li');
        listaTareas.appendChild(liTarea);
        listaTareas.classList.add('li-tarea'); 

        //Se crear y agrega texto de la tarea
        const p = document.createElement('p');
        p.textContent = inputValue;
        liTarea.appendChild(p);
        p.classList.add('text-tarea');
        
        //Se crea y agrega un div contenedor para el checkbox y el btn eliminar
        const inputContainer = document.createElement('div');
        liTarea.appendChild(inputContainer);
        inputContainer.classList.add('input-container');

        //Se crea y agrega el checkbox al div
        const check = document.createElement('input');
        check.type = 'checkbox';
        check.classList.add('check');
        inputContainer.appendChild(check);

        // Se crea y agrega el label del checkbox al div
        const label = document.createElement('label');
        const labelText = document.createTextNode('Terminada');
        label.appendChild(check);
        label.appendChild(labelText);
        inputContainer.appendChild(label);

        /* Se guarda la tarea en el local storage */
        localStorage.setItem('tareas', JSON.stringify(tareas));

        /* Funcionalidad para que cuando se seleccione la tarea como "terminada", esta se vaya al final de la lista y se cambie el estilo */

        //Se lee el evento checkbox para porder marcar la tarea como terminada o no terminada 
        check.addEventListener('change', (e) => {

            //Se define el valor del indice de la tarea para para poder determianr la posición de la tarea en el arr
            let index = tareas.indexOf(nuevoObjTarea);

            //Si el checkbox està seleccionado...
            if(e.target.checked) {

                //Se tacha el texto
                p.style.textDecoration = 'line-through';

                //Se resta la tarea del contador 
                restaContador();

                //Se elimina el li, lo agrega al final del arr y cambia la propiedad completada
                tareas.splice(index, 1);
                tareas.push(nuevoObjTarea);
                nuevoObjTarea.completada = true;

                //Se actualiza la posición en la lista agregando nuevamente el li
                listaTareas.appendChild(liTarea);

                //Se cambia el estilo del fondo que identifica a la tarea como "terminada"
                liTarea.classList.add('li-checked');
            
            //Si el checkbox está deseleccionado...
            } else {
                //el estilo del texto es normal
                p.style.textDecoration = 'none';

                //Se suma la tarea al contador
                sumaContador();

                //Vuelve a dejar la propiedad como false y vuelve a su posicion en la fila
                tareas.splice(index, 1);
                tareas.unshift(nuevoObjTarea);
                nuevoObjTarea.completada = false;

                //Se actualiza la posicion en la lista
                listaTareas.insertBefore(liTarea, listaTareas.firstChild);

                //Cambia el estilo del fondo para dejarla como "No terminada"
                liTarea.classList.remove('li-checked');
            }

        })
        
        /* Al agragar una tarea nueva se aumenta en 1 el contador de tareas */
        sumaContador();

        //Se crea el btn para eliminar la tarea y lo agrega a la li 
        const btnEliminar = document.createElement('button');
        inputContainer.appendChild(btnEliminar);
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.classList.add('btn-eliminar');

        //Al hacer click en btn eliminar se elimina la li 
        btnEliminar.addEventListener('click', () => {
            liTarea.remove();

            //eliminar elemento del arr
            let index = tareas.indexOf(nuevoObjTarea);
            tareas.splice(index, 1);
            
            //resta el contador
            restaContador();  
            
            //Se eliminar del local storage
            const jsonString = localStorage.getItem('tareas');
            const tareasGuardadas = JSON.parse(jsonString);
            //Para definir el indice se compara el indice del objeto en el arr tareas con el indice del nuevoObjTarea
            const indice = tareasGuardadas.findIndex(obj => obj.tareas === nuevoObjTarea);
            //si no encuetra coincidencia devuelve -1

            //si el indice es distitno de -1 (0) elimina el obj
            if (indice !== -1) {
                tareasGuardadas.splice(indice, 1); //(ese 1 es porque es el indice donde para el metodo splice)
            }

            //guardar nuevamente el arr en local storage
            localStorage.setItem('tareas', JSON.stringify(tareas));
           
        }) 
        
        //Al agregar un li, el valor del placeholder vuelve a su estado original
        inputTarea.value = '';

    }
    
}

/* Se declara funcion que resta al contador si se elimina o se selecciona checkbox, ademas cambia el texto del contador.*/
const restaContador = () => {

    if (numTareas > 0) {
        numTareas--;
        contadorTareas.textContent = `Tienes ${numTareas} tarea por hacer 🏗️`;
    }

    if (numTareas === 0) {
        contadorTareas.textContent = 'No tienes tareas por hacer 🎉';
    }     
}

//funcion que suma al contador si se agrega una tareax, ademas cambia el texto del contador.
const sumaContador = () => {

    numTareas++;
    contadorTareas.textContent = `Tienes ${numTareas} tarea por hacer 🏗️`;   
}


//funcion agregar fecha

const fechaActual = () => {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = hoy.getMonth() + 1;
    const dia = hoy.getDate();
    const hora = hoy.getHours();

    if (hora > 6 && hora < 19) {
        fecha.textContent = `🌞 ${dia} de ${mes} del ${anio}`// emoji cambia dependiendo de la hora del dia
    } else {
        fecha.textContent = `🌚 ${dia} de ${mes} del ${anio}`
    }
    
}

fechaActual();

//LLamar funcion principal agregar tarea
btnAgregar.onclick = agregarTarea;








