import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';


function RandomWords(props) {

  return (
    <div className='words'>
      <h2 className='words__heading heading2'>Find and learn</h2>

      <div className='words__table-wrapper'>

        <table>

          <thead>
            <tr>
              <th>
                <Checkbox
                  className='wtable__checkbox'
                  icon={<BookmarkBorderIcon sx={{ fontSize: '1.4rem', color: '#757575c2' }} />}
                  checkedIcon={<BookmarkIcon sx={{ fontSize: '1.4rem'}} />}
                />
              </th>
              <th>word</th>
              <th>translation</th>
              <th>frequency</th>
            </tr>
          </thead>

          <tbody>
            {props.randomWords.map((i) => (
              <tr key={i.word}>
                <td>
                  <Checkbox
                    className='wtable__checkbox'
                    icon={<BookmarkBorderIcon sx={{ fontSize: '1.4rem', color: '#757575c2' }}/>}
                    checkedIcon={<BookmarkIcon sx={{ fontSize: '1.4rem' }}/>}
                  />
                </td>
                <td>{i.word}</td>
                <td>{i.translation}</td>
                <td>{i.frCat}</td>
              </tr>
            ))}
          </tbody>



        </table>

      </div>


    </div>
  )
}

export default RandomWords;
