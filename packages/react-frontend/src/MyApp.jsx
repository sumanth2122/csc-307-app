import React, { useState, useEffect } from "react";
import Table from "./Table"
import Form from "./Form"

const characters = [
    {
      name: "Charlie",
      job: "Janitor"
    },
    {
      name: "Mac",
      job: "Bouncer"
    },
    {
      name: "Dee",
      job: "Aspring actress"
    },
    {
      name: "Dennis",
      job: "Bartender"
    }
  ];

function MyApp() {
    const [characters, setCharacters] = useState([]);
    
    function removeOneCharacter(index) {
      const characterToDelete = characters[index];
  
      // Check if the character has a valid ID
      if (!characterToDelete || !characterToDelete.id) {
          console.error("Invalid character or missing ID.");
          return;
      }
  
      fetch(`http://localhost:8000/users/${characterToDelete.id}`, {
          method: 'DELETE'
      })
      .then((response) => {
          if (response.status === 200) {
              // If the deletion was successful, update the state
              setCharacters((prevCharacters) => 
                  prevCharacters.filter((_, i) => i !== index)
              );
          } else if (response.status === 404) {
              console.error("User not found on the backend.");
          }
      })
      .catch((error) => {
          console.error("Failed to delete user:", error);
      });
  }
  

    function updateList(person) {
        postUser(person)
          .then((res) => {
            if (res.status === 201){
              return res.json();
            } else{
              throw new Error("Fail create user");
            }
          })
          .then((newUser) => {
            setCharacters([...characters, newUser]);
          })
          .catch((error) => {
            console.log(error);
          });
    }
      
          

    function fetchUsers() {
      const promise = fetch("http://localhost:8000/users");
      return promise;
    }

    function postUser(person) {
      const promise = fetch("http://localhost:8000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(person),
      });
      return promise;
    }

    useEffect(() => {
      fetchUsers()
        .then((res) => res.json())
        .then((json) => setCharacters(json["users_list"]))
        .catch((err) => {
          console.log(err);
        });
    }, []);

    return (
      <div className="container">
          <Table characterData={characters}
          removeCharacter={removeOneCharacter} />
          <Form handleSubmit={updateList}/>
      </div>
      );



}

export default MyApp