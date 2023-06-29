import React, { useState, useEffect } from 'react';
import Menu from '../Menu/Menu';

function Dictionary(props) {

  const [otherTransl, setOtherTransl] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);
  const [expandBtnActive, setExpandBtnActive] = useState(false);

  const optionsLimit = 2;

  useEffect(() => {
    if (props.otherTransl.length > 0) {
      const newArr = [];
      props.otherTransl.filter((el) => el.pos).map((i) => {
        i.tr.forEach((t) => {
          newArr.push(t);
        })
        return newArr;
      })
      setExpandBtnActive(false);
      setOtherTransl(newArr);
    }

  }, [props.otherTransl])

  function openMenu(data) {
    setActiveMenu(data);
  }

  useEffect(() => {
    function handleEscClose(e) {
      if (e.key === 'Escape') {
        setActiveMenu(null);
      }
    }

    function handleOutsideClose (e) {
      if (!e.target.classList.contains('menu__ul') && !e.target.classList.contains('table__btn')) {
        setActiveMenu(null);
      }
    }

    document.addEventListener('keyup', handleEscClose);
    document.addEventListener('click', handleOutsideClose);

    return () => {
      document.removeEventListener('keyup', handleEscClose);
      document.removeEventListener('click', handleOutsideClose);
    };
  }, [])

  function handleExpandBtn() {
    setExpandBtnActive(prevState => !prevState);
  }

  return (
    <div className={`dictionary${props.otherTransl.length > 0 ? ' dictionary_active' : ''}`}>
      <h2 className='dictionary__heading'>All translations</h2>
      <div className='dictionary__translations table-wrapper'>

        <table>

          <thead>
            <tr>
              <th>pos</th>
              <th>translation</th>
              <th>synonyms</th>
            </tr>
          </thead>

          <tbody>
            {otherTransl.map((i, index) => (
              <tr key={i.text} className={`table__row${index > optionsLimit && !expandBtnActive ? ' table__row_hidden' : ''}`}>
                <td>{i.pos}</td>

                <td>
                  <div className='table__block table__block_transl'>
                    <div className='table__btn-word'>
                      <button className='table__btn table__btn_transl' onClick={() => openMenu(i.text)}>{i.text}</button>
                      <Menu
                        menuActive={activeMenu === i.text ? true : false}
                        addTranslate={() => props.addTranslate(i.text, true)}
                        addToList={props.addToList}
                        compareFreq={() => props.compareFreq(i, true)}
                        compareFreqActive={props.outputLang === 'English' ? true : false}
                      />
                    </div>
                    {i.syn?.map((s) => (
                      <div className='table__btn-word' key={s.text}>
                        <button className='table__btn table__btn_transl' onClick={() => openMenu(s.text)}>{s.text}</button>
                        <Menu
                          menuActive={activeMenu === s.text ? true : false}
                          addTranslate={() => props.addTranslate(i.text, true)}
                          addToList={props.addToList}
                          compareFreq={() => props.compareFreq(i, true)}
                          compareFreqActive={props.outputLang === 'English' ? true : false}
                        />
                      </div>
                    ))}
                  </div>
                </td>

                <td>
                  <div className='table__block table__block_syn'>
                    {
                      i.mean ?
                      i.mean?.map((m) => (
                        <div className='table__btn-word' key={m.text}>
                          <button className='table__btn table__btn_syn' onClick={() => openMenu(m.text)}>{m.text}</button>
                          <Menu
                            menuActive={activeMenu === m.text ? true : false}
                            addTranslate={() => props.addTranslate(m.text, false)}
                            addToList={() => props.addToList(m.text)}
                            compareFreq={() => props.compareFreq(i.mean)}
                            compareFreqActive={props.inputLang === 'English' ? true : false}
                          />
                        </div>
                      )) : <span>-</span>
                    }
                  </div>
                </td>
              </tr>
            ))}

          </tbody>

        </table>
        <button className='table__expand-btn' type='button' onClick={handleExpandBtn}>
          Show {`${expandBtnActive ? 'fewer' : 'more'}`} options
        </button>
      </div>


    </div>
  )
}

export default Dictionary;
