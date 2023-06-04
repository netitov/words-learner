import React, { useState, useEffect } from 'react';

function Dictionary(props) {

  const [otherTransl, setOtherTransl] = useState([]);

  useEffect(() => {
    if(props.otherTransl.length > 0) {
      const newArr = [];
      props.otherTransl.filter((el) => el.pos).map((i) => {
        i.tr.forEach((t) => {
          newArr.push(t);
        })
        return newArr;
      })
      setOtherTransl(newArr);
    }
  }, [props.otherTransl])


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
              <tr key={index}>
                <td>{i.pos}</td>

                <td>
                  <div className='table__block table__block_transl'>
                    <span>{i.text}</span>
                    {i.syn?.map((s) => (
                        <span key={s.text}>{s.text}</span>
                    ))}
                  </div>
                </td>

                <td>
                  <div className='table__block table__block_syn'>
                    {
                      i.mean ?
                      i.mean?.map((m) => (
                        <span key={m.text}>{m.text}</span>
                      )) : <span>-</span>
                    }
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>


    </div>
  )
}

export default Dictionary;
