class RegistroHoras {
    constructor() {
        this.registros = JSON.parse(localStorage.getItem('registros')) || [];
    }

    agregarRegistro(nombre, rango, entrada, salida) {
        const tiempoTrabajado = this.calcularTiempoTrabajado(entrada, salida);
        const estado = this.evaluarEstado(tiempoTrabajado);

        const registro = {
            nombre,
            rango,
            entrada,
            salida,
            tiempoTrabajado: this.formatearTiempo(tiempoTrabajado),
            estado
        };

        this.registros.push(registro);
        this.guardarRegistros();
        this.mostrarRegistros();
        this.verificarHorasMinimas(registro);
    }

    calcularTiempoTrabajado(entrada, salida) {
        const inicioFecha = new Date(entrada);
        const finFecha = new Date(salida);
        return (finFecha - inicioFecha) / 1000 / 60 / 60; // Horas
    }

    evaluarEstado(tiempoTrabajado) {
        return tiempoTrabajado >= 3 ? 'cumplido' : 'incumplido';
    }

    formatearTiempo(horas) {
        const horasEnteras = Math.floor(horas);
        const minutos = Math.floor((horas - horasEnteras) * 60);
        const segundos = Math.floor(((horas - horasEnteras) * 60 - minutos) * 60);
        return `${horasEnteras}h ${minutos}m ${segundos}s`;
    }

    guardarRegistros() {
        localStorage.setItem('registros', JSON.stringify(this.registros));
    }

    mostrarRegistros() {
        const tablaRegistros = document.getElementById('tablaRegistros');
        tablaRegistros.innerHTML = '';

        this.registros.forEach((registro, index) => {
            const fila = document.createElement('tr');
            fila.classList.add(registro.estado === 'cumplido' ? 'cumplido' : 'incumplido');
            
            fila.innerHTML = `
                <td>${registro.nombre}</td>
                <td>${registro.rango}</td>
                <td>${registro.entrada}</td>
                <td>${registro.salida}</td>
                <td>${registro.tiempoTrabajado}</td>
                <td>${registro.estado === 'cumplido' ? '✓' : '✗'}</td>
            `;

            tablaRegistros.appendChild(fila);
        });
    }

    verificarHorasMinimas(registro) {
        const notificaciones = document.getElementById('notificaciones');
        if (registro.estado === 'incumplido') {
            const mensaje = `⚠️ ${registro.nombre} no cumplió con las 3 horas mínimas`;
            const notificacion = document.createElement('div');
            notificacion.textContent = mensaje;
            notificaciones.appendChild(notificacion);
        }
    }

    buscarPorNombre(nombre) {
        return this.registros.filter(registro => 
            registro.nombre.toLowerCase().includes(nombre.toLowerCase())
        );
    }

    reiniciarRegistros() {
        this.registros = [];
        localStorage.removeItem('registros');
        this.mostrarRegistros();
    }
}

const registroHoras = new RegistroHoras();

function registrarHoras() {
    const nombre = document.getElementById('nombreInput').value;
    const rango = document.getElementById('rangoInput').value;
    const entrada = document.getElementById('entradaInput').value;
    const salida = document.getElementById('salidaInput').value;

    if (nombre && rango && entrada && salida) {
        registroHoras.agregarRegistro(nombre, rango, entrada, salida);
    } else {
        alert('Por favor, complete todos los campos');
    }
}

function buscarPersona() {
    const busqueda = document.getElementById('buscarInput').value;
    const resultados = registroHoras.buscarPorNombre(busqueda);
    
    const tablaRegistros = document.getElementById('tablaRegistros');
    tablaRegistros.innerHTML = '';

    resultados.forEach(registro => {
        const fila = document.createElement('tr');
        fila.classList.add(registro.estado === 'cumplido' ? 'cumplido' : 'incumplido');
        
        fila.innerHTML = `
            <td>${registro.nombre}</td>
            <td>${registro.rango}</td>
            <td>${registro.entrada}</td>
            <td>${registro.salida}</td>
            <td>${registro.tiempoTrabajado}</td>
            <td>${registro.estado === 'cumplido' ? '✓' : '✗'}</td>
        `;

        tablaRegistros.appendChild(fila);
    });
}

// Botón para reiniciar registros
const botonReiniciar = document.createElement('button');
botonReiniciar.textContent = 'Reiniciar Registros';
botonReiniciar.onclick = () => registroHoras.reiniciarRegistros();
document.querySelector('.container').appendChild(botonReiniciar);

// Cargar registros al iniciar
registroHoras.mostrarRegistros();