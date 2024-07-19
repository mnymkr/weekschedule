// import { GroupBase, Options } from "react-select"
import { availableTerms, Course, courseData } from "../data"
import config from './config'
import { loadPersonalPlansFromLocalStorage } from "./localStorage"


export const MAJORS = [
  {value: 'ARTS', label: 'Arts and Media'},
  {value: 'CORE', label: 'Core'},
  {value: 'CS', label: 'Computer Science'},
  {value: 'ECON', label: 'Economics'},
  {value: 'ENG', label: 'Engineering'},
  {value: 'HIS', label: 'History'},
  {value: 'IS', label: 'Integrated Science'},
  {value: 'LIT', label: 'Literature'},
  {value: 'MATH', label: 'Mathematics'},
  {value: 'PSY', label: 'Psychology'},
  {value: 'SOCI', label: 'Social Sciences'},
  {value: 'VS', label: 'Vietnamese Studies'}
]

export const CATEGORIES = ['Core', 'E1', 'E2', 'E3', 'E4', 'C1', 'C2', 'C3', 'C4', 'Seminar', 'EL', 'Personal']
  .map(s => ({label: s, value: s}))

export const LEVELS = ['100', '200', '300'].map(
  level => ({label: level, value: level})
)

export const getCourse = (id: string) => {
  const allCourses: Course[] = availableTerms.reduce(
    (courses, thisTerm) => {
      const coursesThisTerm = courseData[thisTerm] 
      const personalPlans = loadPersonalPlansFromLocalStorage()
      const combined = [...coursesThisTerm, ...personalPlans] // AMOGUS
      return courses.concat(combined)
    }, 
    [] as Course[]
  )
  const matches = allCourses.filter(course => {
    return course.id === id
  })
  if (matches.length > 0) {
    return matches[0]
  } else {
    return null
  }
}

export const getMajor = (id: string) => {
  const head = id.slice(0, id.indexOf('_'))
  const split = head.search(/\d/g)
  return head.slice(0, split)
}

export const getLevel = (id: string) => {
  const head = id.slice(0, id.indexOf('_'))
  const split = head.search(/\d/g)
  return head[split] + '00'
}

// export const getDates = (course) => `${course.start_date} - ${course.end_date}`

export const getSchedule = (course: Course) => course.schedule
  .map(({day, start_time, end_time}) => `${day} ${start_time} - ${end_time}`)
  .join('\n')

export const getNotes = (course: Course) => course.description.split('---')[0]

export const getCategories = (course: Course) => course.categories.join(', ')

export const getDescription = (course: Course) => {
  const des = course.description
  const split = des.indexOf('---')
  return des.slice(split + 4)
}

export const isSelected = (selected: Array<Course>, id: string) => 
  (selected.filter(course => course.id === id).length > 0)

export const getRandomCourses = (n: number) => {
  const courses = courseData[config.currentTerm]
  const total = courses.length
  if (n > total) {
    throw new RangeError("Requesting more elements than available.")
  }
  const chosen: string[] = []
  while (n--) {
    const available = courses.filter(course => !chosen.includes(course.id))
    const id = Math.floor(Math.random() * available.length)
    chosen.push(courses[id].id)
  }
  return chosen
}