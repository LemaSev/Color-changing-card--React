import { FaPlus } from 'react-icons/fa';
import { useRef } from 'react';

const AddItem = ({ newItem, setNewItem, handleSubmit }) => {
    const inputRef = useRef();// here we define the useRef//

    return (
        <form className='addForm' onSubmit={handleSubmit} /*the onSubmit event handler is saying, 
        "When the form is submitted, don't do the usual thing that forms do,
         like refreshing the page.Instead, just do what I specify in my event handler." */ > 
         
            <label htmlFor='addItem'>Add Item</label>
            <input
                autoFocus
                ref={inputRef} //here we make it clear to where we want the focus to be after clicking the button//
                id='addItem'
                type='text'
                placeholder='Add Item'
                required
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
            />
            <button
                type='submit'
                aria-label='Add Item'
                onClick={() => inputRef.current.focus()} // when the button is clicked, it will set the focus back to the input//
            >
                <FaPlus />
            </button>
        </form>
    )
}

export default AddItem