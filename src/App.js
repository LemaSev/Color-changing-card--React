import Header from './Header';
import SearchItem from './SearchItem';
import AddItem from './AddItem';
import Content from './Content';
import Footer from './Footer';
import { useState, useEffect } from 'react';
import apiRequest from './apiRequest';

function App() {
  const API_URL = 'http://localhost:3500/items';

  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [search, setSearch] = useState('');
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    const fetchItems = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw Error('Did not receive expected data');
        const listItems = await response.json();
        setItems(listItems);
        setFetchError(null);
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    setTimeout(() => fetchItems(), 2000);

  }, [])

  const addItem = async (item) => {
    const id = items.length ? items[items.length - 1].id + 1 : 1;
    const myNewItem = { id, checked: false, item };
    const listItems = [...items, myNewItem];
    setItems(listItems);

    const postOptions = {/*  This creates an object named postOptions.  */
      method: 'POST', /* specifies that the HTTP request method should be a POST request. After we add the items, the request should be made then.  */
      headers: { /* is an object specifying the HTTP headers for the request. In this case, 
      it includes a header for the content type, indicating that the request body is in JSON format. */
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(myNewItem)  /* is the data to be sent in the request body. myNewItem is assumed to be a JavaScript object, and JSON.stringify is used to convert it into a JSON-formatted string. */
    }
    const result = await apiRequest(API_URL, postOptions); 
    /* This line declares a variable named result and assigns the result of an asynchronous API request to it.
    It calls the apiRequest function (presumably defined elsewhere), 
    passing API_URL as the URL and postOptions as the options for the POST request.
    The await keyword is used to wait for the asynchronous operation to complete before moving to the next line */

    if (result) setFetchError(result);

   /*  After making the request, it checks if there was an error (result is truthy),
    and if so, it sets the fetch error using the setFetchError function. */
  }


 /*  We're defining a function called handleCheck, and it can do some special tasks. 
  The (id) part means we can tell it which specific thing we want it to work on. */
  const handleCheck = async (id) => {
    const listItems = items.map((item) => item.id === id ? { ...item, checked: !item.checked } : item);
    setItems(listItems);

  /*   We're working with a list of items, and we're updating one of them. 
    If the item's ID matches the one we provided to the function, we change its "checked" status. Then, we update the overall list. */

    const myItem = listItems.filter((item) => item.id === id);
    const updateOptions = {
      method: 'PATCH', /* the PATCH method is used to apply partial modifications to a resource. Instead of updating the entire resource */
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ checked: myItem[0].checked })
    };
/*     We're making a set of instructions to tell the computer,
     "Hey, we changed something! Here are the details of what we changed." */


    const reqUrl = `${API_URL}/${id}`;

   /*  We're making a special address to tell the computer exactly where to find the thing we updated. 
    It's like giving the computer a map to locate our change. */

    const result = await apiRequest(reqUrl, updateOptions);

/*     We're using a function called apiRequest to send our instructions and the location to the computer. 
    We wait for the computer to finish its job before moving on. */

    if (result) setFetchError(result);
  /*   We check if the computer had any problems doing what we asked. If there's a problem, we let someone know (using setFetchError).
     If everything went well, we don't need to worry. */
  }

  const handleDelete = async (id) => {
    const listItems = items.filter((item) => item.id !== id);
    setItems(listItems);

    const deleteOptions = { method: 'DELETE' };
    const reqUrl = `${API_URL}/${id}`;
    const result = await apiRequest(reqUrl, deleteOptions);
    if (result) setFetchError(result);
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
        {isLoading && <p>Loading Items...</p>}
        {fetchError && <p style={{ color: "red" }}>{`Error: ${fetchError}`}</p>}
        {!fetchError && !isLoading && <Content
          items={items.filter(item => ((item.item).toLowerCase()).includes(search.toLowerCase()))}
          handleCheck={handleCheck}
          handleDelete={handleDelete}
        />}
      </main>
      <Footer length={items.length} />
    </div>
  );
}

export default App;