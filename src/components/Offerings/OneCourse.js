import React from 'react'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import { useParams, useRouteMatch } from 'react-router-dom'
import { getCategories, getCourse, getDescription, getNotes, getSchedule, isSelected } from '../../utils/course'
import AddDropBtn from '../utils/AddDropBtn'
import './OneCourse.scss'
import { Link } from 'react-router-dom'

const OneCourse = () => {
  const courseId = useParams().id
  const course = getCourse(courseId)
  if (!course) {
    return <div>
      <h1>Course not found</h1>
      <p>If you think this is a bug, let us know!</p>
      <br />
      <p>Or 
      <Link to='/custom-schedule'> create a new personal plan.</Link>
      </p>
    </div>
  }
  const selectedCourses = useSelector(state => state.selectedCourses.value)
  const selected = isSelected(selectedCourses, course.id)
  
  const OneStop = () => (
    <a href={course.url}> {course.id} </a>
  )
  const Row = ({header, content}) => {
    return (
      <tr>
        <td className='fw-bold'> {header} </td>
        <td className='multiple-lines'> {content} </td>
      </tr>
    )
  }
  
  return (
    <div className='text-start m-4'>
      <Helmet>
        <title> {course.title} </title>
      </Helmet>
      
      <div className="d-flex flex-column border-bottom mb-4 align-items-start">
        <div className='d-flex flex-row align-items-end w-100'>
          <h4 className='flex-grow-1'>
            {course.id}  
          </h4>
          <AddDropBtn course={course} preStatus={selected} />
        </div>

        <h1 className='display-4'>{course.title}</h1>
      </div>
      
      <div className='d-flex flex-column flex-md-row justify-content-around'>
        <div className=' multiple-lines col-md-6 order-2 order-md-1' style={{paddingLeft: '10px'}}>
          {getDescription(course)}
        </div>
        <div className='flex-grow-1 pb-4 pt-md-0 ms-md-5 order-1 order-md-2'>

          <table className='table table-hover table-bordered'>
            <tbody>
              <Row header='Instructor' content={course.instructor} />
              <Row header='Schedule' content={getSchedule(course)} />
              <Row header='Location' content={course.location} />
              <Row header='Categories' content={getCategories(course)} />
              <Row header='Credits' content={course.credits} />
              <Row header='OneStop URL' content={<OneStop />} />
              <Row header='Further notes' content={getNotes(course)} />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default OneCourse
