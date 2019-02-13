import React, { Component } from 'react'
import './Events.css'
import Modal from '../components/Modal/Modal'
import BackDrop from '../components/Backdrop/Backdrop'
import AuthContext from '../context/auth-context';

export default class Auth extends Component {
  state={
    creating: false
  }

  static contextType = AuthContext;

  constructor(props){
    super(props)
    this.titleElRef = React.createRef()
    this.priceElRef = React.createRef()
    this.dateElRef = React.createRef()
    this.descriptionElRef = React.createRef()
  }

  createEvetnHandler = ()=>{
    this.setState({
      creating: true
    })
  }

  modalConfirm = ()=>{
   
    console.log("in modal confirm")
    const title = this.titleElRef.current.value;
    const price = +this.priceElRef.current.value;
    const date  = this.dateElRef.current.value;
    const description = this.descriptionElRef.current.value;
    if(title.trim().length ===0 || price <= 0 || date.trim().length === 0 || description.trim().length === 0){
      console.log( "in if")
      return ;
    }
    const event = {title, price, date, description};
    console.log(event)

    const requsetBody  = {
      query : `
        mutation {
          createEvent(eventInput : { title: "${title}", description: "${description}", price: ${price}, date: "${date}"}){
             _id
             title
             description
             price
             date
             creator {
               _id
               email
             }
          }
        }
      `
    };

    const token = this.contextType.token;
    console.log("token =", token)

    fetch('http://localhost:5000/graphql',{
      method:'POST',
      body: JSON.stringify(requsetBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }).then(res => {
      if(res.status !== 200 && res.status !== 201){
        throw new Error('Failed');
      }
      return res.json()
    }).then(resData => {
      console.log("resdata =",resData)
    }).catch(err => console.log(err))

    this.setState({
      creating: false
    });
  }

  modalCancel = () => {
    this.setState({
      creating: false
    })
  }

  render() {
    return (
      <React.Fragment>
        {this.state.creating && <BackDrop />}
        {this.state.creating && <Modal canCancel title="Add Event" canConfirm
        onConfirm={this.modalConfirm}
        onCancel={this.modalCancel}
        >
        <form>
        <div className="form-control">
          <label htmlFor="title">Title</label>
           <input type="text" id="title" ref={this.titleElRef}/>
        </div>
        <div className="form-control">
          <label htmlFor="price">Price</label>
           <input type="number" id="price" ref={this.priceElRef} />
        </div>
        <div className="form-control">
          <label htmlFor="date">Date</label>
           <input type="datetime-local" id="date" ref={this.dateElRef}/>
        </div>
        <div className="form-control">
          <label htmlFor="description">Description</label>
           <textarea rows="5" id="description" ref={this.descriptionElRef} />
        </div>
        </form>
        
      </Modal>}
       
      <div className="events-control">
        <p>Share Your Events</p>
        <button className="btn" onClick={this.createEvetnHandler}>create event</button>
      </div>
      </React.Fragment>
    )
  }
}
