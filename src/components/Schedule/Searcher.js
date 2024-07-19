import {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleSelection } from '../../store/selectedCoursesSlice'
import { selectCurrentTerm } from '../../store/selectors'
import { isSelected } from '../../utils/course'
import './Searcher.scss'
import { selectCurrentSelectedCourseIds } from '../../store/selectors'
import { Link } from 'react-router-dom'

const Searcher = () => {
  const [ filter, setFilter ] = useState('')
  const [ focusItem, setFocusItem ] = useState(0)
  const dispatch = useDispatch()

  const selectedCourses = useSelector(selectCurrentSelectedCourseIds)

  const courses = useSelector(selectCurrentTerm) // AMOGUS

  let matchedCourses = []
  let nVisibleCourses = 0

  const handleArrowDown = () => {
    setFocusItem((focusItem + 1) % nVisibleCourses)
  }

  const handleArrowUp = () => {
    setFocusItem((focusItem + nVisibleCourses - 1) % nVisibleCourses)
  }

  const collapseSuggestions = () => {
    changeText("")
    document.getElementById('search-input').value = ""
  }

  const handleShortcuts = (event) => {
    if (event.key === 'Escape') {
      collapseSuggestions()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleShortcuts)

    return () => {
      window.removeEventListener('keydown', handleShortcuts)
    }
  })

  const changeText = (text) => {
    setFilter(text);
    setFocusItem(0);
  }

  const onInputChanged = (event) => {
    const text = event.target.value;
    changeText(text);
  }

  const onCourseToggle = (id) => {
    dispatch(toggleSelection({id}))
    collapseSuggestions()
  }
  
  // search appearances
  const CourseInfo = (course) => {
    return (
      // <div className="d-flex flex-row justify-content-between align-items-center">
      //   <div className="course-id text-sm">{course.id.split("_")[0]}</div>
      //   <div className="mx-1 course-title">{course.title}</div>
      //   <div className="instructor-name text-sm mx-1 border-left">{course.instructor}</div>
      // </div>
      <div>
        <b>{course.title}</b>
        {` by ${course.instructor} [${course.id}]`}
      </div>
    )
  }
  
  // compare input to course data
  const CourseList = () => {
    matchedCourses = courses.filter((course) => 
      (course.title + "|" + course.instructor + "|" + course.id) //course.id.split("_")[0]) to exclude _Fall2021_... part
      .toLowerCase().includes(filter.toLowerCase())
    )

    if (matchedCourses.length === 0) {
      return (
      <button className="list-group-item">
        No courses or plans matched. <br /> 
          <Link to="/custom-schedule" >
            Create a new plan.
          </Link>
      </button>)
    } else {
      nVisibleCourses = Math.min(5, matchedCourses.length)
      return matchedCourses
        .slice(0, nVisibleCourses)
        .map((course) => 
          <button 
            className={`
              px-0 list-group-item
              ${isSelected(selectedCourses, course.id) ? "fw-bold" : ""}
              ${isFocused(course.id) ? "focus" : ""}
            `}
            onClick={() => onCourseToggle(course.id)}
            key={course.id}
          >
            {CourseInfo(course)}
          </button>
        )
    }
  }

  const isFocused = (id) => (matchedCourses[focusItem].id === id)
  
  return (
    <div className="filter position-relative">
      <input 
        className="form-control py-2" 
        id="search-input"
        placeholder="Add courses to schedule"
        autoComplete="off"
        onChange={onInputChanged} 
        onKeyDown={(event) => {
          // TODO: refactor
          if (event.key === 'ArrowUp') {
            handleArrowUp()
          } else if (event.key === 'ArrowDown') {
            handleArrowDown()
          } else if (event.key === 'Enter') {
            if (matchedCourses.length === 0) {
              return 
            }
            onCourseToggle(matchedCourses[focusItem].id)
          }
        }}
      />
      {
        filter !== "" ?
          <div className="selecting list-group shadow position-absolute w-100">
            <CourseList/>
            {/* <p className="list-group-item"> {matchedCourses.length} courses matched. </p> */}
          </div>
        : <></>
      }
    </div>
  )
}

export default Searcher