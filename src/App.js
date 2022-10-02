import { useRef, useState } from 'react';
import alarm from './assets/alert.mp3';
import Swal from 'sweetalert2';
import './App.css';

function App() {
  const bodyPom = useRef();
  const bodyShort = useRef();
  const buttonPom = useRef();
  const buttonShort = useRef();
  const pomContainer = useRef();
  const timePo = useRef();
  const timeShort = useRef();
  const main = useRef();

  const initialPom = '20:00';
  const initialShort = '5:00';

  const [tiempPo, setTiempPo] = useState(initialPom);
  const [tiempShort, setTiempShort] = useState(initialShort);

  const [intervalo, setIntervalo] = useState();

  const [conteoInt, setConteoInt] = useState();

  const [buttonText, setButtonText] = useState('Pausa');

  const handlePom = () => {
    main.current.classList.add('colorPam');
    main.current.classList.remove('colorShort');

    bodyPom.current.style.display = 'flex';
    bodyShort.current.style.display = 'none';

    pomContainer.current.classList.add('colorPamCon');
    pomContainer.current.classList.remove('colorShortCon');

    buttonPom.current.style.backgroundColor = '#d95550';
    buttonShort.current.style.backgroundColor = 'inherit';

    clearInterval(intervalo);
    setButtonText('Pausa');
    setTiempPo(initialPom);
  };

  const handleShort = () => {
    main.current.classList.add('colorShort');
    main.current.classList.remove( 'colorPom');

    bodyPom.current.style.display = 'none';
    bodyShort.current.style.display = 'flex';

    pomContainer.current.classList.remove('colorPamCon');
    pomContainer.current.classList.add('colorShortCon');

    buttonPom.current.style.backgroundColor = 'inherit';
    buttonShort.current.style.backgroundColor = '#4c9195';

    clearInterval(intervalo);
    setButtonText('Pausa');
    setTiempShort(initialShort);
  };

  const handleOnClickStart = (tiemp) => {
    let audio = new Audio();
    audio.src = alarm;


    let timeLimit = tiemp; //tiempo en minutos
    let conteo = new Date(timeLimit * 60000);

    let intervaloRegresivo = setInterval(() => {
      if (conteo.getTime() > 0) {
        conteo.setTime(conteo.getTime() - 1000);
      } else {
        clearInterval(intervaloRegresivo);
        audio.play();
        audio.loop = true;

        if (tiemp > 5) {
          Swal.fire({
            title: 'Tarea finalizada!',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok!'
          }).then((result) => {
            if (result.isConfirmed) {
              audio.pause();
            }
          })
          
        } else {
          Swal.fire({
            title: 'Descanso finalizado!',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok!'
          }).then((result) => {
            if (result.isConfirmed) {
              audio.pause();
            }
          })
        }
      }
      setConteoInt(conteo);

      if (conteo.getSeconds() >= 10) {
        let cadena = conteo.getMinutes() + ':' + conteo.getSeconds();
        setTiempPo(cadena.toString());
        setTiempShort(cadena.toString());
      } else {
        let cadena = conteo.getMinutes() + ': 0' + conteo.getSeconds();
        setTiempPo(cadena.toString());
        setTiempShort(cadena.toString());
      }

      setIntervalo(intervaloRegresivo);
    }, 1000);
  };

  const handleOnClickPausa = () => {
    if (buttonText === 'Pausa') {
      setButtonText('Reanudar');
      clearInterval(intervalo);
    }

    if (buttonText === 'Reanudar') {
      setButtonText('Pausa');
      let intervaloRegresivo = setInterval(() => {
        if (conteoInt.getTime() > 0) {
          conteoInt.setTime(conteoInt.getTime() - 1000);
        }
        let cadena = conteoInt.getMinutes() + ':' + conteoInt.getSeconds();
        setTiempPo(cadena.toString());
        setTiempShort(cadena.toString());

        setIntervalo(intervaloRegresivo);
      }, 1000);
    }
  };
  const handleOnClickRest = () => {
    clearInterval(intervalo);
    setButtonText('Pausa');
    setTiempPo(initialPom);
    setTiempShort(initialShort);
  };

  return (
    <main ref={main}>
      <div className='pomContainer' ref={pomContainer}>
        <section className='pomTitle'>
          <h2>Pomodoro</h2>
          <div className='pomButtons'>
            <button ref={buttonPom} onClick={handlePom}>
              Pomodoro
            </button>
            <button ref={buttonShort} onClick={handleShort}>
              Short break
            </button>
          </div>
        </section>
        <section className='pomBodyPom' ref={bodyPom}>
          <div className='pomTime' ref={timePo}>
            {tiempPo}
          </div>
          <div>
            <button
              onClick={() => {
                handleOnClickStart(20);
              }}
            >
              Iniciar
            </button>
            <button onClick={handleOnClickPausa}>{buttonText}</button>
            <button
              onClick={() => {
                handleOnClickRest(1);
              }}
            >
              Reiniciar
            </button>
          </div>
        </section>
        <section className='pomBodyShort' ref={bodyShort}>
          <div className='pomTime' ref={timeShort}>
            {tiempShort}
          </div>
          <div>
            <button
              onClick={() => {
                handleOnClickStart(1);
              }}
            >
              Iniciar
            </button>
            <button onClick={handleOnClickPausa}>{buttonText}</button>
            <button onClick={handleOnClickRest}>Reiniciar</button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
