import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Select from 'react-select';
import { toggleSelection } from '../../store/selectedCoursesSlice';
import { useDispatch } from 'react-redux';

function EventForm() {
    const dispatch = useDispatch(); 

    // declare event object 
    const [event, setEvent] = useState({
        eventName: '', 
        daysOccuring: '',
        startTime: '',
        endTime: '',
        description: ''
    });

    const [selectedDays, setSelectedDays] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const submitEvent = (e) => {
        e.preventDefault(); 

        const newEventId = 'Personal' + uuidv4();

        // retrieve existing events from local storage
        const existingEventsJSON = localStorage.getItem('personalPlans');
        const existingEvents = (existingEventsJSON ?  JSON.parse(existingEventsJSON) : []);

        // create new event object from the form 
        const newEvent = {
            title: event.eventName, 
            credits: 0,
            id: newEventId,
            url: 'https://example.com/',
            description: event.description,
            categories: ['Personal'],
            location: 'Personal',
            instructor: 'Personal',
            schedule: event.daysOccuring.split(',').map(
                day => ({
                    day: day.trim(), 
                    start_time: event.startTime, 
                    end_time: event.endTime
                })
            )
        };


        // add new event to existing events
        const allEvents = [...existingEvents, newEvent];


        localStorage.setItem('personalPlans', JSON.stringify(allEvents));
        
        dispatch(toggleSelection(newEvent)) // add to redux store
        
        // reset form fields
        setEvent({
            eventName: '', 
            daysOccuring: '',
            startTime: '',
            endTime: '',
            description: ''
        });
        setSelectedDays([]);
        setIsSubmitted(true);
    }

    const recordEventDetails = (e) => {
        setEvent({ ...event, [e.target.name]: e.target.value });
    }

    const options = [
        { value: 'Monday', label: 'Monday' },
        { value: 'Tuesday', label: 'Tuesday' },
        { value: 'Wednesday', label: 'Wednesday' },
        { value: 'Thursday', label: 'Thursday' },
        { value: 'Friday', label: 'Friday' },
        { value: 'Saturday', label: 'Saturday' },
        { value: 'Sunday', label: 'Sunday' },
      ];

    
    const handleDaysSelection = selectedOption => {
        const days = selectedOption.map(option => option.label);
        const daysString = days.join(', ');
        setEvent({ ...event, daysOccuring: daysString });
        setSelectedDays(selectedOption);
    };

    const handleFocus = () => {
        setIsSubmitted(false);
    }
    
    return (
        <div className="enforce-size bg-light p-3 border rounded collapse show"> 
            <h4>Add Your Event </h4> 
            { isSubmitted && 
            <div className='confirm-box p-3 border rounded'>
                Event has been added to your schedule!
            </div>
            }
            
            <hr /> 
            <div className="d-flex flex-column align-items-center">
                
            </div>
            <form onSubmit={submitEvent}>
                <label htmlFor="eventName"> Event name </label> <br />
                <input 
                    className='input' 
                    type="text" 
                    name="eventName" 
                    value={event.eventName} 
                    placeholder="Basketball" 
                    onChange={recordEventDetails} 
                    required 
                    title='Enter name of event'
                    onFocus={handleFocus}
                /> <br />

                {/* <label htmlFor="daysOccuring"> Days Occurring </label> <br />
                <input className='input' type="text" name="daysOccuring" value={event.daysOccuring} placeholder="Monday, Friday" onChange={recordEventDetails} required /> <br /> */}

                <label htmlFor="daysOccuring"> Days Occurring </label> <br />
                <div className='multi-input'>
                    <Select
                        isMulti
                        name="daysOccuring"
                        options={options}
                        className='basic-multi-select'
                        classNamePrefix='select'
                        onChange = {handleDaysSelection}
                        onFocus={handleFocus}
                        value = {selectedDays}
                        title='Select the days of a week the event will occur'
                        required
                    />
                </div>

                <label htmlFor="description">Description</label> <br /> 
                <input 
                    className='input' 
                    type="text" 
                    name="description" 
                    value={event.description} 
                    placeholder="Basketball practice" 
                    onChange={recordEventDetails} 
                    title='(Optional) Provide a short description'
                    onFocus={handleFocus}
                /> <br />
                
                <div className='time-picker-row'>
                    <label htmlFor="startTime"> Start Time </label> 
                    <label htmlFor="endTime" > End Time </label> 
                </div>
                <div className='time-picker-row'>
                    <input 
                        className='input' 
                        type="time" 
                        name="startTime" 
                        value={event.startTime} 
                        onChange={recordEventDetails} 
                        // placeholder='09:00 AM'
                        title='e.g. 09:00 AM'
                        onFocus={handleFocus}
                        required 
                    />
                    <input 
                        className='input' 
                        type="time" 
                        name="endTime" 
                        value={event.endTime} 
                        onChange={recordEventDetails} 
                        // placeholder='04:30 PM'
                        title='e.g. 04:30 PM'
                        onFocus={handleFocus}
                        required 
                    />
                </div>
                
                <br />
                <button type="submit" className="btn btn-primary mb-3">Add Event</button>

            </form>
        </div>
    )
}

export default EventForm;