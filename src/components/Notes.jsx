import React,{useContext, useEffect, useRef, useState} from 'react'
import noteContext from "../context/notes/noteContext"
import NoteItem from './NoteItem';
import AddNote from './AddNote'
import { useNavigate } from 'react-router-dom';

const Notes = (props) => {
    const context = useContext(noteContext)
    let navigate=useNavigate();

    const {notes, getNotes, editNote}= context;

    useEffect(() => {  
      if(localStorage.getItem('token')){
        getNotes()
      }
      else{
        navigate("/login");
      }
   
    }, [])
    const updateNote=(currentNote)=>{
        ref.current.click();
        setnote({id: currentNote._id , etitle:currentNote.title, edescription: currentNote.description, etag: currentNote.tag})

    }
    const ref= useRef(null)
    const refClose= useRef(null)

    const [note, setnote] = useState({id:"", etitle:"", edescription:"", etag:"Default"})
    const handleClick=(e)=>{
        editNote(note.id, note.etitle, note.edescription, note.etag)
        refClose.current.click();
        props.showAlert("Updated Successfully", "success")

    }

    const onChange=(e)=>{
        setnote({...note, [e.target.name]: e.target.value})

    }

  return (
    <>
    <AddNote showAlert={props.showAlert}/>
    

    <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
  Launch demo modal
</button>

<div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel"  aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
      <form>
<div className="mb-3">
  <label htmlFor="title" className="form-label">Title</label>
  <input type="text" className="form-control" id="etitle" name="etitle" value={note.etitle} aria-describedby="emailHelp" onChange={onChange} minLength={5} required/>

</div>
<div className="mb-3">
  <label htmlFor="description" className="form-label">Description</label>
  <input type="text" className="form-control" id="edescription" name='edescription' value={note.edescription} onChange={onChange} minLength={5} required/>
</div>
<div className="mb-3">
  <label htmlFor="tag" className="form-label">Tag</label>
  <input type="text" className="form-control" id="etag" name='etag' value={note.etag} onChange={onChange}/>
</div>

</form>
      </div>
      <div className="modal-footer">
        <button type="button" ref={refClose} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" disabled={note.etitle.length<5 || note.edescription.length<5} onClick={handleClick} className="btn btn-primary">Update Note</button>
      </div>
    </div>
  </div>
</div>
    <div className='row my-3'>
    <h2>Your Notes</h2>
    {notes.length===0 && 'No Notes to display'}
    {notes.map((note) => {
        return <NoteItem key= {note._id} updateNote={updateNote} showAlert={props.showAlert} note={note}/>;
      })}
    </div>
    </>
  )
}

export default Notes
