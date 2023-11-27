import { FaTrashAlt } from 'react-icons/fa';

const LineItem = ({ item, handleCheck, handleDelete }) => {
    return (
        <li className="item">
            <input
                type="checkbox"
                onChange={() => handleCheck(item.id)} 
               /*  This sets up an event handler for the checkbox.
                When the checkbox state changes, it calls the
                 handleCheck function with the item.id as an argument. */
                checked={item.checked}
            />
            <label
                style={(item.checked) ? { textDecoration: 'line-through' } : null}
                onDoubleClick={() => handleCheck(item.id)}
            >{item.item}</label> {/* This is a label for the item.
             If the item is checked (item.checked is true),
             it applies a style with a line-through text decoration.  */}
            
            <FaTrashAlt
                onClick={() => handleDelete(item.id)}
                role="button" /* These are attributes used for accessibility,
                 indicating that the trash icon is interactive and 
                 can be focused and activated using a keyboard. */
                tabIndex="0"
                aria-label={`Delete ${item.item}`} /* Another accessibility feature,
                 providing a label for screen readers to announce when 
                 the icon is focused. */
            />
        </li>
    )
}

export default LineItem

