import React, { Component } from 'react';
import { CSSTransition } from 'react-transition-group';
import Contacts from './components/Contacts';
import './index.css';
const shortid = require('shortid');
var debounce = require('lodash.debounce');
class App extends Component {
    state = {
        error: false,
        contacts: [],
        filter: [],
        contactsBul: false
    }
    btnValue = (event) => {
        event.preventDefault()
        const valueName = event.target[0].value;
        const valueNumber = event.target[1].value;
        if (valueName.length === 0 || valueNumber.length === 0) {
            return
        }
        const test = this.state.contacts.find((num) => {
            return num.name === valueName
        })
        if (test !== undefined) {
            this.errorAlert()
            event.target[0].value = '';
            event.target[1].value = '';
            return
        }

        this.setState({
            contactsBul: true
        })
        this.state.contacts.push({ id: shortid.generate(), name: valueName, number: valueNumber });
        event.target[0].value = '';
        event.target[1].value = '';
    }
    errorAlert = () => {
        this.setState({
            error: true
        })
        setTimeout(() => {
            this.setState({
            error: false
        })
        }, 3000);
    }
    deleteContact = (even) => {
        const total = this.state.contacts.filter((num) => {
            return num.id !== even.target.id
        })
        this.setState({
            contacts: [...total]
        })
        if (this.state.filter.length > 0) {
            const total = this.state.filter.filter((num) => {
            return num.id !== even.target.id
        })
        this.setState({
            filter: [...total]
        })
        }
    }
    findContact = (even) => {
        if (even.target.value === "") {
            return
        }
        const filter = this.state.contacts.filter(num => {
            return num.name.includes(even.target.value)
        })
        this.setState({
            filter: [...filter]
        })
    }
    render() {
        const contacts = this.state.contacts
        return (
            <>
                <header>
                <CSSTransition in={true} appear timeout={500} classNames="logo" >
                <h1 className="logo">Phonebook</h1>
                </CSSTransition>
                <CSSTransition in={this.state.error} timeout={500} classNames="error" unmountOnExit>
                <h1 className="error">Contact already exist</h1>
                </CSSTransition>
                </header>
                <main>
                    <form onSubmit={this.btnValue} className="addForm">
                        <p>Name</p>
                        <input type="text" className="nameInp" />
                        <p>Number</p>
                        <input type="tel" className="numberInp"/>
                        <button type="submit" className="btnSub" >Add Contact</button>
                    </form>
                    {this.state.contacts.length > 0 ? <div className="filter">
                        <p className="textFilter">Find contacts by name</p>
                        <input type="text" className="filterInp" onChange={debounce(this.findContact,1000)}/>
                    </div> : null}
                    <div id="ListContacts">
                        {this.state.filter.length > 0 ? <Contacts contacts={this.state.filter} delet={this.deleteContact}/> : <Contacts contacts={contacts} delet={this.deleteContact} />}
                    </div>
                </main>
            </>
        )
    }
}
export default App