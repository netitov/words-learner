import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-scroll';
import { MdTranslate } from 'react-icons/md';
import { TfiStatsUp } from 'react-icons/tfi';
import { MdOutlineCompareArrows } from 'react-icons/md';
import { GiFilmStrip } from 'react-icons/gi';
import { MdOutlineQuiz } from 'react-icons/md';
import { BsBookmarks } from 'react-icons/bs';

function About() {

  const [animation, setAnimation] = useState(false);
  const pathRef = useRef();

  useEffect(() => {
    function runAnimation() {
      const elementPos = pathRef.current.getBoundingClientRect().top;
      const elementHeight = pathRef.current.offsetHeight;
      const windowHeight = window.innerHeight;

      if (elementPos < windowHeight - (elementHeight * 0.5)) {
        setAnimation(true);
      } else {
        setAnimation(false);
      }
    }

    window.addEventListener('scroll', runAnimation);
    return () => window.removeEventListener('scroll', runAnimation);
  });

  const cards = [
    {
      icon: <MdTranslate />,
      title: 'Translate',
      description: 'View different translate options',
      to: 'translator',
    },
    {
      icon: <MdOutlineCompareArrows />,
      title: 'Compare frequency',
      description: 'View which word is more common',
      to: 'translator',
    },
    {
      icon: <GiFilmStrip />,
      title: 'Check usages',
      description: 'In how many percent of movies word appears',
      to: 'frequency',
    },
    {
      icon: <MdOutlineQuiz />,
      title: 'Take the tests',
      description: 'Select words or use random',
      to: 'quiz'
    },
    {
      icon: <TfiStatsUp />,
      title: 'Track your progress',
      description: 'View learning stats',
      to: 'quiz'
    },
    {
      icon: <BsBookmarks />,
      title: 'Create learning lists',
      description: 'Add any words',
      to: 'random'
    },
  ];

  return (
    <nav >
      <ul className={`about${animation ? ' about_active' : ''}`} ref={pathRef}>
        {cards.map((card, index) => (
          <li key={index} className="about__item">
            <Link
              className="about__card"
              to={card.to || ''}
              smooth={true}
              /* duration={400} */
            >
              <div className="about__svg-wrapper">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default About;
