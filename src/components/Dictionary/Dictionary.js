import React, { useState, useEffect, useRef } from 'react';
import Menu from '../Menu/Menu';
import RefTooltip from '../RefTooltip/RefTooltip';


function Dictionary(props) {

  const [otherTransl, setOtherTransl] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);
  const [expandBtnActive, setExpandBtnActive] = useState(false);

  const ref = useRef(null);

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

    //animate slide in/out
    /* if (props.otherTransl.length > 0) {
      ref.current.classList.remove('dictionary_hidden');
      setTimeout(() => {
        ref.current.classList.add('dictionary_active');
      })
    } else {
      ref.current.classList.remove('dictionary_active');
      setTimeout(() => {
        ref.current.classList.add('dictionary_hidden');
      }, 200)
    } */

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

  //select function: update current word translation or add/remove word from learn list
  function handleWordUpdate(text) {
    const userLang = JSON.parse(localStorage.getItem('userLang'));
    if (userLang.lang !== props.inputLang && !props.savedTranslation.includes(text) && props.savedTranslation.length > 0) {
      props.handleUpdateList(props.chars, text);
    } else {
      props.handleLearnList(props.chars, text, props.savedTranslation.includes(text));
    }
  }

  //select function: update current word translation for Synonym or add/remove word from learn list
  function handleSynUpdate(text) {
    const userLang = JSON.parse(localStorage.getItem('userLang'));
    if (userLang.lang === props.inputLang && !props.savedTranslationSyn.includes(text) && props.isChecked) {
      props.handleUpdateList(props.translation, text);
    } else {
      props.handleLearnList(text, props.translation, props.savedTranslationSyn.includes(text));
    }
  }

  return (
    <div className={`dictionary${props.otherTransl.length > 0 ? ' dictionary_active' : ''}`} ref={ref}>
      <h2 className='dictionary__heading'>All translations</h2>
      <div className='dictionary__translations table-wrapper'>

        <table>

          <thead>
            <tr>
              <th>pos</th>
              <th>
                <div className='table__head-box'>
                  <span>translation</span>
                  <RefTooltip
                    class={`table__tooltip${props.outputLang === 'English' ? ' table__tooltip_active' : ''}`}
                    /* color='#757575' */
                  >
                    <p>Сlick on the appropriate translation option to view more features
                    </p>
                  </RefTooltip>
                </div>
              </th>
              <th>
                <div className='table__head-box'>
                  <span>synonyms</span>
                  <RefTooltip
                    class={`table__tooltip${props.inputLang === 'English' ? ' table__tooltip_active' : ''}`}
                    /* color='#757575' */
                  >
                    <p>Сlick on the appropriate synonym to view more features
                    </p>
                  </RefTooltip>
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            {otherTransl.map((i, index) => (
              <tr key={i.text} className={`table__row${index > optionsLimit && !expandBtnActive ? ' table__row_hidden' : ''}`}>

                <td>{i.pos}</td>

                {/* translation column */}
                <td>
                  <div className='table__block table__block_transl'>
                    <div className='table__btn-word'>
                      <button
                        className={`table__btn table__btn-transl${props.savedTranslation.includes(i.text) ? ' table__btn-transl_active' : ''}`}
                        onClick={() => openMenu(i.text)}
                      >
                        {props.savedTranslation.includes(i.text) ? <span>✔</span> : ''}{i.text}
                      </button>
                      <Menu
                        menuActive={activeMenu === i.text ? true : false}
                        addTranslate={() => props.addTranslate(i.text, true)}
                        handleList={() => handleWordUpdate(i.text)}
                        isSaved={() => props.savedTranslation.includes(i.text)}
                        compareFreq={() => props.compareFreq(i, true)}
                        compareFreqActive={props.outputLang === 'English' ? true : false}
                      />
                    </div>
                    {i.syn?.map((s) => (
                      <div className='table__btn-word' key={s.text}>
                        <button
                          className={`table__btn table__btn-transl${props.savedTranslation.includes(s.text) ? ' table__btn-transl_active' : ''}`}
                          onClick={() => openMenu(s.text)}>
                          {props.savedTranslation.includes(s.text) ? <span>✔</span> : ''}{s.text}
                        </button>
                        <Menu
                          menuActive={activeMenu === s.text ? true : false}
                          addTranslate={() => props.addTranslate(i.text, true)}
                          handleList={() => handleWordUpdate(s.text)}
                          isSaved={() => props.savedTranslation.includes(s.text)}
                          compareFreq={() => props.compareFreq(i, true)}
                          compareFreqActive={props.outputLang === 'English' ? true : false}
                        />
                      </div>
                    ))}
                  </div>
                </td>

                {/* synonyms column */}
                <td>
                  <div className='table__block table__block_syn'>
                    {
                      i.mean ?
                      i.mean?.map((m) => (
                        <div className='table__btn-word' key={m.text}>
                          <button
                            className={`table__btn table__btn-syn${props.savedTranslationSyn.includes(m.text) ? ' table__btn-syn_active' : ''}`}
                            onClick={() => openMenu({ translation: i.text, syn: m.text })}>
                              {props.savedTranslationSyn.includes(m.text) ? <span>✔</span> : ''}{m.text}
                            </button>
                          <Menu
                            /* double check for menu because there might be several same synonyms  */
                            menuActive={activeMenu?.syn === m.text && activeMenu?.translation === i.text ? true : false}
                            addTranslate={() => props.addTranslate(m.text, false)}
                            handleList={() => handleSynUpdate(m.text)}
                            isSaved={() => props.savedTranslationSyn.includes(m.text)}
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

        {/* pagination btn */}
        <button
          className={`table__expand-btn${otherTransl.length <= (optionsLimit + 1) ? ' table__expand-btn_inactive' : '' }`}
          type='button'
          onClick={handleExpandBtn}>
          Show {`${expandBtnActive ? 'fewer' : 'more'}`} options
        </button>

      </div>

    </div>
  )
}

export default Dictionary;
