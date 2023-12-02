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

/* step 1. */
  useEffect(() => {

    // step 2. This is a task: fetch (items) from a special place (API_URL). 
    const fetchItems = async() => {

      /*  step 3. while you are getting the items, if something goes wrong, let me know, so I can stop waiting. */
      try {


      /*  step 4: The helper goes to the store (API_URL) and asks for toys (items). It waits patiently for the store to respond. */
      const response = await fetch (API_URL);
     
      /*  step 5: Your helper(fetch) checks if the store (API) is okay. If there's a problem,You want it to say exactly what happened. So, your helper says, "If something goes wrong, I'll tell you what went wrong."  */
        if (!response.ok) throw Error('Did not receive expected data');
        
      /* step 6: Assuming everything is fine, your helper(fetch) takes the toys(items: listItems) out of the bag the store (API) gave. */
      const listItems = await response.json();
         

       /* step 7: Put all the Items you got in a new box called "setItems" */
        setItems(listItems);

       /* Step 8: If there was any problem before, you're saying, "Now everything is okay! No more problems. Forget about any issues we had before." */
        setFetchError(null);

      /*   
        step 9: If something went wrong at the store, your helper says,"Oh no, there's a problem! I'll tell you what happened so we can fix it." */
      } catch (err){
        setFetchError(err.message);
      } 
      
      /*  Step 10:  Whether everything went well or there was a problem, you tell your helper(fetch), "Now that you're back from the store, stop waiting(loading). I don't need your help anymore. */
      finally{
        setIsLoading(false);
      }
    };
    
      /*  Step 11:  This is like saying, "Wait for a little bit (2 seconds), and then go to the store and get some toys." It's like a delayed task for your helper. */
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