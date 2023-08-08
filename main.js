
//Firabase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js"
import { getDatabase, ref, onValue, push, remove} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://lista-de-tareas-3de76-default-rtdb.firebaseio.com/"
}
const app = initializeApp(appSettings)
const database = getDatabase(app)
const tareasInDB = ref(database, "tareas")



//LLamar a los elementos del html
const inputTarea = document.getElementById('input-tarea');
const btnAgregar = document.getElementById('agregar-tarea');
const listaTareas = document.getElementById('lista-tareas');
const fecha = document.getElementById('fecha');

//funcion que agregar el elemento a su contenedor y agrega el nombre de css class al crear una tarea
const agregarElementoHTMLyClase = (contenedor, elemento, nombreClase, contenidoTextContent) => {
    contenedor.append(elemento);
    elemento.classList.add(nombreClase);
    elemento.textContent = contenidoTextContent;
}
//Funcion para Reseatear el text input
const resetTextInput = () => inputTarea.value = "";

//funcion para agregar tarea a la lista
const agregarTarea = (tareaID, tareaValue) => { 

    const liTarea = document.createElement('li');
    agregarElementoHTMLyClase(listaTareas, liTarea, 'li-tarea');
 
    const textTarea = document.createElement('p');
    agregarElementoHTMLyClase(liTarea, textTarea, 'text-tarea', tareaValue)
 
    const inputContainer = document.createElement('div');
    agregarElementoHTMLyClase(liTarea, inputContainer, 'input-container');
    
    const btnEliminar = document.createElement('button');
    agregarElementoHTMLyClase(inputContainer, btnEliminar, 'btn-eliminar', 'Eliminar');

    btnEliminar.addEventListener('click', () => {
        console.log(tareaID)
        let ubicacionTareaenBD = ref(database, `tareas/${tareaID}`);
        remove(ubicacionTareaenBD);
        liTarea.remove();
    })
}

onValue(tareasInDB, function(snapshot) {

    if (snapshot.exists()) {
        let tareasArray = Object.entries(snapshot.val());
        listaTareas.innerHTML = "";
        for (let i = 0; i < tareasArray.length; i++) {
            let tareaActual = tareasArray[i];
            let tareaActualID = tareaActual[0]
            let tareaActualValue = tareaActual[1]
            agregarTarea(tareaActualID, tareaActualValue);
        }
    }
})

btnAgregar.addEventListener('click', () => {  
     
    const inputTareaValue = inputTarea.value.trim(); 
    
    if (inputTareaValue !== "") { 
        agregarTarea();
        // Ingresa la tarea en la BD
        push(tareasInDB, inputTareaValue);
        resetTextInput();
    } 
})

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

