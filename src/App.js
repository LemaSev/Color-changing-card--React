import Header from './Header';
import SearchItem from './SearchItem';
import AddItem from './AddItem';
import Content from './Content';
import Footer from './Footer';
import { useState, useEffect } from 'react';

function App() {
  const API_URL ='http://localhost:3500/items'; //this is where we get our array information from. 

  const [items, setItems] = useState ([]); //this is the array we want initially to load the application with. 
  const [newItem, setNewItem] = useState('');
  const [search, setSearch] = useState('');
  const [fetchError,setFetchError] = useState(null);
  const [isLoading,setIsLoading] = useState(true);

  useEffect(() => {

    //1. fetch (items) from a special place (API_URL). 
      const fetchItems = async() => {
      try {
        const response = await fetch (API_URL);
         /* 2. It goes to the API URL  and brings back a big list of items (response). */

        if (!response.ok) throw Error('Did not receive expected data');
        //3. check if the items arrived safely, if not throw an an error message. If there's a problem,You want it to say exactly what happened. So, your helper says, "If something goes wrong, I'll tell you what went wrong."
       

        const listItems = await response.json();
        /* 4.  Open the list and Show each item */ 
    

       /*  5.Put Items in item Box */
        setItems(listItems);

       /*  6. if there is no error, reset and continue to show the items.  */
        setFetchError(null);
        

      /*  7. Check for Errors and Tell If Something Goes Wrong */
      } catch (err){
        setFetchError(err.message);
      } finally{
        setIsLoading(false);
       /* 8. it's like saying, "Whether there was a problem or everything went smoothly, we want to make sure that the loading indicator (isLoading) is turned off, */
      }
    };
      /*  Start the Task Right Away. Your helper doesn't want to waste time. As soon as you ask for items, it goes to the store and
        starts the special task. It doesn't wait around! */
      setTimeout(() => {
          (async ()=> await fetchItems())();
        }, 2000)
      },[])

  

  const addItem = (item) => {
    const id = items.length ? items[items.length - 1].id + 1 : 1;
    const myNewItem = { id, checked: false, item };
    const listItems = [...items, myNewItem];
    setItems(listItems);
  }

  const handleCheck = (id) => {
    const listItems = items.map((item) => item.id === id ? { ...item, checked: !item.checked } : item);
    setItems(listItems);
  }

  const handleDelete = (id) => {
    const listItems = items.filter((item) => item.id !== id);
    setItems(listItems);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItem) return;
    addItem(newItem);
    setNewItem('');
  }

  return (
    <div className="App">
      <Header title="Grocery List" />
      <AddItem
        newItem={newItem}
        setNewItem={setNewItem}
        handleSubmit={handleSubmit}
      />
      <SearchItem
        search={search}
        setSearch={setSearch}
      />

      <main>
        {/* if isLoading is true then display the message: Loading items */}
        {isLoading && <p>Loading Items...</p>}

        {fetchError && /* This states "If there's a problem (fetchError), do the thing inside the parentheses." */(
          <p style={{ color: "red" }}>

            {`Error: ${fetchError}`} {/* Inside the message, it says,  "There's an error," and it shows you what the problem is (the fetchError). */}
          </p>
        )}


        {/*  if there is no fetch error, and if we are not loading, then continue to display the content */}

        {!fetchError && !isLoading && <Content
          items={items.filter(item => ((item.item).toLowerCase()).includes(search.toLowerCase()))}
          handleCheck={handleCheck}
          handleDelete={handleDelete}
        />
        }
      </main>
      <Footer length={items.length} />
    </div>
  );
}

export default App;