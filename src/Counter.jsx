import React from 'react'
import 'whatwg-fetch'
import { Link, withRouter } from 'react-router-dom'

const $ = (qs) => { let a = document.querySelectorAll(qs);if (a.length > 1) { return a } else { return a[0] }}
function CounterList (props) {
    const citem = props.counterData.map(ctr => (
        <CounterItem key={ctr._id} counter={ctr} />
    ));
    return (
        <table className="counter_list">{citem}</table>
    )
}

function CounterItem (props) {
    const tdWidth = {
        width: '10%'
    }
    return (
        <Link to={`/counter/${props.counter._id}`}> {/*`*/}
            <tr>
                <td style={tdWidth}>
                    &nbsp;&nbsp;
                    &nbsp;&nbsp;
                    <span id={`mark${props.counter._id}`}></span> {/*`*/}
                    &nbsp;&nbsp;
                </td>
                <td>{props.counter.title}</td>
            </tr>   
        </Link>
    )
}


class Counter extends React.Component {
    constructor (props) {
        super()
        this.state = {
            'counterData': [],
            '_id': null, 'title': null,
            'number': '0000', 'created': null,
            'lastUpdate': null,
            'newTitle': '', 'newNumber': 0,
        }
        this.loadData = this.loadData.bind(this)
        this.onEditBoxChange = this.onEditBoxChange.bind(this)
        this.handleEdit = this.handleEdit.bind(this)
        this.renderCounter = this.renderCounter.bind(this)
        this.updateCounter = this.updateCounter.bind(this)
        this.addNewCounter = this.addNewCounter.bind(this)
        this.deleteCounter = this.deleteCounter.bind(this)
    }

    componentDidMount() {
        this.loadData()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params !== this.props.match.params) {
            this.renderCounter(this.props.match.params.id)
        }
    }
    
    loadData() {
        fetch(`/api/counters`).then(res => {
            res.json().then(data => {
                data.forEach(counter => {
                    counter.created = new Date(counter.created)
                    counter.lastUpdate = new Date(counter.lastUpdate)
                    counter.number = counter.number.toString()
                    counter.number = '0'.repeat(4-counter.number.length) + counter.number
                })
                this.setState({ 'counterData': data, })
                if (this.props.match.params.id == undefined) {
                    this.props.history.push('/counter/' + this.state.counterData[0]._id)
                } else {
                    this.props.history.push('/counter/' + this.props.match.params.id)
                }
            })
        })
    }

    renderCounter(id) {
        let data = this.state.counterData.find((d) => d._id === id);
        this.setState(
            {
                '_id': data._id, 'title': data.title,
                'number': data.number, 'created': data.created,
                'lastUpdate': data.lastUpdate,
                'newTitle': data.title, 'newNumber': Number.parseInt(data.number),
            }
        );
        let marker = $('.counter_list span');
        marker.forEach((x) => x.innerText = '');
        $('#mark'+data._id).innerText = ">";
        $('#sideToggle').checked = false;
        
    }

    addNewCounter(e) {
		e.preventDefault(); // prevent website refreash from form submit
        let form = document.forms.addNewCounter
        let data = { 'title': form.title.value }
        fetch(`/api/counters`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(res => { 
            if (res.ok) {
                res.json().then(newCounter => {
                    newCounter.created = new Date(newCounter.created)
                    newCounter.lastUpdate = new Date(newCounter.lastUpdate)
                    newCounter.number = newCounter.number.toString()
                    newCounter.number = '0'.repeat(4-newCounter.number.length) + newCounter.number

                    let newCounterData = this.state.counterData.concat(newCounter)
                    this.setState({ counterData: newCounterData })
                    form.title.value = ""
                })
            } else {
                res.json().then(err => alert(`Failed to Add: ${err.message}`))
            }
        }).catch(err => alert(`Error on submit: ${err.message}`));
    }
                
    onEditBoxChange() {
        let form = document.forms.editBox
        this.setState({ 'newTitle': form.title.value, 'newNumber': form.number.value })
    }

    handleEdit(e) {
        e.preventDefault()
        this.updateCounter({ 'title': this.state.newTitle, 'number': this.state.newNumber })
        return
    }

    updateCounter(input) {
        let data = {}
        if (typeof input.number != "undefined")
            if (input.number < 0 || input.number > 9999)
                return
            else
                data['number'] = input.number
        if (typeof input.title != "undefined")
            data['title'] = input.title

            fetch(`/api/counter/${this.props.match.params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            }).then(res => {
                if (res.ok) {
                    res.json().then(newData => {
                        newData.number = newData.number.toString()
                        newData.number = '0'.repeat(4 - newData.number.length) + newData.number.toString()
                        newData.lastUpdate = new Date(newData.lastUpdate)
                        let newCounterData = this.state.counterData.map(counter => {
                            if (counter._id === newData._id) {
                                counter.title = newData.title
                                counter.number = newData.number
                                counter.lastUpdate = newData.lastUpdate
                            }
                            return counter
                        })
                        this.setState(
                                        { 
                                            'counterData': newCounterData,
                                            'title': newData.title,
                                            'number': newData.number,
                                            'lastUpdate': newData.lastUpdate,
                                            'newNumber': Number.parseInt(newData.number),
                                        }
                        )
                        if ($('#editToggle').checked)
                            $('#editToggle').checked = false
                    })
                } else {
                    res.json().then(err => 
                        console.log(`Failed to Update: ${err.message}`))
                }
            }).catch(err => console.log(`Error on submit: ${err.message}`));
    }

    deleteCounter() {
        let ask = confirm(`Delete counter ${this.state.title}?(You cannot resolve after delete.)`)
        if (ask) {
            fetch(`/api/counter/${this.props.match.params.id}`, {
                method: 'DELETE'
            }).then(res => {
                if (!res.ok) {
                    alert("Error: Fail to delete counter")
                } else { 
                    let newCounterData = this.state.counterData.filter(counter => {
                        if (counter._id === this.props.match.params.id)
                            return false
                        else
                            return true
                    })
                    this.props.history.push('/counter/' + this.state.counterData[0]._id)
                    this.setState({ 'counterData': newCounterData })
                    $('#editToggle').checked = false
                }
            })
        }
    }

    render() {
        return (
            <counter>
                <input type="checkbox" id="sideToggle" />
                <input type="checkbox" id="editToggle" />
                <label for="editToggle" id="editBackLabel">&nbsp;&nbsp;&lt;&nbsp;&nbsp;</label>
                <counter_title>
                    &nbsp;<label for="sideToggle" id="sideToggleLabel">&#9776;</label>
                    <img id="pngCounter" src="https://img.icons8.com/dotty/80/000000/counter.png" />
                    &nbsp;Counter</counter_title>
                <counter_name>{this.state.title}</counter_name>
                <counter_num>{this.state.number}</counter_num>
                <counter_details>
                    <counter_id>ID: {this.state._id}</counter_id>
                    <counter_date>Created: {this.state.created ? `${this.state.created.toDateString()} ${this.state.created.toLocaleTimeString()}` : ''} </counter_date>
                    <counter_date>Last Update: {this.state.lastUpdate ? `${this.state.lastUpdate.toDateString()} ${this.state.lastUpdate.toLocaleTimeString()}` : ''} </counter_date>

                    <ul>
                        <li>
                            <img onClick={ () => this.updateCounter({ 'number': Number.parseInt(this.state.number) - 1} ) } id="minus" alt="minus" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iMTYiIGhlaWdodD0iMTYiCnZpZXdCb3g9IjAgMCAxNzIgMTcyIgpzdHlsZT0iIGZpbGw6IzAwMDAwMDsiPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0wLDE3MnYtMTcyaDE3MnYxNzJ6IiBmaWxsPSJub25lIj48L3BhdGg+PGcgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTg2LDYuODhjLTQzLjY1NjAzLDAgLTc5LjEyLDM1LjQ2Mzk3IC03OS4xMiw3OS4xMmMwLDQzLjY1NjAzIDM1LjQ2Mzk3LDc5LjEyIDc5LjEyLDc5LjEyYzQzLjY1NjAzLDAgNzkuMTIsLTM1LjQ2Mzk3IDc5LjEyLC03OS4xMmMwLC00My42NTYwMyAtMzUuNDYzOTcsLTc5LjEyIC03OS4xMiwtNzkuMTJ6TTg2LDEzLjc2YzM5LjkzNzc5LDAgNzIuMjQsMzIuMzAyMjEgNzIuMjQsNzIuMjRjMCwzOS45Mzc3OSAtMzIuMzAyMjEsNzIuMjQgLTcyLjI0LDcyLjI0Yy0zOS45Mzc3OSwwIC03Mi4yNCwtMzIuMzAyMjEgLTcyLjI0LC03Mi4yNGMwLC0zOS45Mzc3OSAzMi4zMDIyMSwtNzIuMjQgNzIuMjQsLTcyLjI0ek00NC43Miw4Mi41NnY2Ljg4aDgyLjU2di02Ljg4eiI+PC9wYXRoPjwvZz48L2c+PC9zdmc+" />
                            <img onClick={ () => this.updateCounter({ 'number': Number.parseInt(this.state.number) + 1} ) } id="plus" alt="plus" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iNTAiIGhlaWdodD0iNTAiCnZpZXdCb3g9IjAgMCAxNzIgMTcyIgpzdHlsZT0iIGZpbGw6IzAwMDAwMDsiPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0wLDE3MnYtMTcyaDE3MnYxNzJ6IiBmaWxsPSJub25lIj48L3BhdGg+PGcgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTg2LDYuODhjLTQzLjY1NjAzLDAgLTc5LjEyLDM1LjQ2Mzk3IC03OS4xMiw3OS4xMmMwLDQzLjY1NjAzIDM1LjQ2Mzk3LDc5LjEyIDc5LjEyLDc5LjEyYzQzLjY1NjAzLDAgNzkuMTIsLTM1LjQ2Mzk3IDc5LjEyLC03OS4xMmMwLC00My42NTYwMyAtMzUuNDYzOTcsLTc5LjEyIC03OS4xMiwtNzkuMTJ6TTg2LDEzLjc2YzM5LjkzNzc5LDAgNzIuMjQsMzIuMzAyMjEgNzIuMjQsNzIuMjRjMCwzOS45Mzc3OSAtMzIuMzAyMjEsNzIuMjQgLTcyLjI0LDcyLjI0Yy0zOS45Mzc3OSwwIC03Mi4yNCwtMzIuMzAyMjEgLTcyLjI0LC03Mi4yNGMwLC0zOS45Mzc3OSAzMi4zMDIyMSwtNzIuMjQgNzIuMjQsLTcyLjI0ek04Mi41Niw0NC43MnYzNy44NGgtMzcuODR2Ni44OGgzNy44NHYzNy44NGg2Ljg4di0zNy44NGgzNy44NHYtNi44OGgtMzcuODR2LTM3Ljg0eiI+PC9wYXRoPjwvZz48L2c+PC9zdmc+" />
                        </li>
                        <li>
                            <img onClick={ () => this.updateCounter({ 'number': 0 }) } id="reset" alt="reset" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iNDgiIGhlaWdodD0iNDgiCnZpZXdCb3g9IjAgMCAxNzIgMTcyIgpzdHlsZT0iIGZpbGw6IzAwMDAwMDsiPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0ibm9uZSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0wLDE3MnYtMTcyaDE3MnYxNzJ6IiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD48ZyBmaWxsPSIjZmZmZmZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGlkPSJzdXJmYWNlMSI+PHBhdGggZD0iTTE0My4zMzMzMyw4NmMwLDMxLjY2MjExIC0yNS42NzEyMiw1Ny4zMzMzMyAtNTcuMzMzMzMsNTcuMzMzMzNjLTMxLjY2MjExLDAgLTU3LjMzMzMzLC0yNS42NzEyMiAtNTcuMzMzMzMsLTU3LjMzMzMzYzAsLTMxLjY2MjExIDI1LjY3MTIyLC01Ny4zMzMzMyA1Ny4zMzMzMywtNTcuMzMzMzNjNy45Nzg1MSwwIDE1LjUzNzExLDEuNzA3NjggMjIuNDUxODMsNC42NDcxNGwtMTcuOTQ0NjcsMTkuMTc2NDNsNTMuNjk0MDEsLTEuNzkxNjdsLTQuNTYzMTUsLTUwLjY5ODU3bC0xNS44NDUwNSwxNi45MDg4NWMtMTEuMTk3OTIsLTYuMTU4ODUgLTI0LjA3NTUyLC05Ljc0MjE5IC0zNy43OTI5NywtOS43NDIxOWMtNDMuNTMxOSwwIC03OC44MzMzMywzNS4zMDE0MyAtNzguODMzMzMsNzguODMzMzNjMCw0My41MzE5IDM1LjMwMTQzLDc4LjgzMzMzIDc4LjgzMzMzLDc4LjgzMzMzYzQzLjUzMTksMCA3OC44MzMzMywtMzUuMzAxNDMgNzguODMzMzMsLTc4LjgzMzMzeiI+PC9wYXRoPjwvZz48L2c+PC9nPjwvc3ZnPg==" />    
                            <label id="editToggleLabel" for="editToggle"><img id="edit" alt="edit" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iMjQiIGhlaWdodD0iMjQiCnZpZXdCb3g9IjAgMCAxNzIgMTcyIgpzdHlsZT0iIGZpbGw6IzAwMDAwMDsiPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0wLDE3MnYtMTcyaDE3MnYxNzJ6IiBmaWxsPSJub25lIj48L3BhdGg+PGcgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTEzMS45Njc0NCwxNC4zMzMzM2MtMS44MzM3NiwwIC0zLjY2OTU2LDAuNjk4NTMgLTUuMDY3MDYsMi4wOTk2MWwtMTIuMjMzNzIsMTIuMjMzNzJsMjguNjY2NjcsMjguNjY2NjdsMTIuMjMzNzIsLTEyLjIzMzcyYzIuODAyMTcsLTIuODAyMTcgMi44MDIxNywtNy4zMzkxMSAwLC0xMC4xMzQxMmwtMTguNTMyNTUsLTE4LjUzMjU1Yy0xLjQwMTA4LC0xLjQwMTA4IC0zLjIzMzI5LC0yLjA5OTYxIC01LjA2NzA2LC0yLjA5OTYxek0xMDMuOTE2NjcsMzkuNDE2NjdsLTgyLjQxNjY3LDgyLjQxNjY3djI4LjY2NjY3aDI4LjY2NjY3bDgyLjQxNjY3LC04Mi40MTY2N3oiPjwvcGF0aD48L2c+PC9nPjwvc3ZnPg==" /></label>
                        </li>
                    </ul>
                </counter_details>
                <counter_side id="counter_side">
                    <h2>Counter List 
                    </h2>
                    <form id="addNewCounter" onSubmit={ this.addNewCounter }>
                        <input name="title" maxLength="20" id="addBox" type="text" placeholder="&nbsp;Title" required/>
                        <button type="submit">
                            <img alt="add" id='add' src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iMjQiIGhlaWdodD0iMjQiCnZpZXdCb3g9IjAgMCAxNzIgMTcyIgpzdHlsZT0iIGZpbGw6IzAwMDAwMDsiPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0ibm9uZSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0wLDE3MnYtMTcyaDE3MnYxNzJ6IiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD48ZyBmaWxsPSIjZmZmZmZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGlkPSJzdXJmYWNlMSI+PHBhdGggZD0iTTc4LjgzMzMzLDE0LjMzMzMzdjY0LjVoLTY0LjV2MTQuMzMzMzNoNjQuNXY2NC41aDE0LjMzMzMzdi02NC41aDY0LjV2LTE0LjMzMzMzaC02NC41di02NC41eiI+PC9wYXRoPjwvZz48L2c+PC9nPjwvc3ZnPg==" />
                        </button>
                    </form>
                    <CounterList counterData={this.state.counterData} />
                </counter_side>
                <counter_edit>
                    <h2>Edit</h2>
                    <form id="editBox" onSubmit={ this.handleEdit }>
                        <table>
                            <tr className="editTitleRow">
                                <td className="editTitle">Title:&nbsp;</td>
                                <td className="editInput"><input type="text" name="title" maxLength="20" id="editBoxTitle" placeholder="&nbsp;Title" onChange={ this.onEditBoxChange } value={this.state.newTitle} required /></td>
                            </tr>
                            <tr className="editNumberRow">
                                <td className="editTitle">Number:&nbsp;</td>
                                <td className="editInput"><input type="number" name="number" id="editBoxNumber" maxlength="4"  min="0" max="9999" placeholder="&nbsp;Number" onChange={ this.onEditBoxChange } value={this.state.newNumber} required /></td>
                            </tr>
                        </table>
                                <button type="submit"><img alt="submit" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iNDgiIGhlaWdodD0iNDgiCnZpZXdCb3g9IjAgMCAxNzIgMTcyIgpzdHlsZT0iIGZpbGw6IzAwMDAwMDsiPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0wLDE3MnYtMTcyaDE3MnYxNzJ6IiBmaWxsPSJub25lIj48L3BhdGg+PGcgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTI4LjY2NjY3LDU3LjMzMzMzdjc4LjgzMzMzaDExNC42NjY2N3YtNzguODMzMzNoMTQuMzMzMzN2NzguODMzMzNjMCw3Ljg4MzMzIC02LjQ1LDE0LjMzMzMzIC0xNC4zMzMzMywxNC4zMzMzM2gtMTE0LjY2NjY3Yy03Ljg4MzMzLDAgLTE0LjMzMzMzLC02LjQ1IC0xNC4zMzMzMywtMTQuMzMzMzN2LTc4LjgzMzMzeiI+PC9wYXRoPjxwYXRoIGQ9Ik0xMTguMjUsNTcuMzMzMzNsLTMyLjI1LC0zNS44MzMzM2wtMzIuMjUsMzUuODMzMzNoMjEuNXY2MC45MTY2N2gyMS41di02MC45MTY2N3oiPjwvcGF0aD48L2c+PC9nPjwvc3ZnPg=="/></button>
                                <img className="editButton" alt="trash" onClick={ this.deleteCounter } src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iNDgiIGhlaWdodD0iNDgiCnZpZXdCb3g9IjAgMCAxNzIgMTcyIgpzdHlsZT0iIGZpbGw6IzAwMDAwMDsiPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0wLDE3MnYtMTcyaDE3MnYxNzJ6IiBmaWxsPSJub25lIj48L3BhdGg+PGcgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTcxLjY2NjY3LDE0LjMzMzMzbC03LjE2NjY3LDcuMTY2NjdoLTM1LjgzMzMzdjE0LjMzMzMzaDExNC42NjY2N3YtMTQuMzMzMzNoLTM1LjgzMzMzbC03LjE2NjY3LC03LjE2NjY3ek0zNS44MzMzMyw1MC4xNjY2N3Y5My4xNjY2N2MwLDcuODgzMzMgNi40NSwxNC4zMzMzMyAxNC4zMzMzMywxNC4zMzMzM2g3MS42NjY2N2M3Ljg4MzMzLDAgMTQuMzMzMzMsLTYuNDUgMTQuMzMzMzMsLTE0LjMzMzMzdi05My4xNjY2N3pNNTcuMzMzMzMsNjQuNWgxNC4zMzMzM3Y3OC44MzMzM2gtMTQuMzMzMzN6TTEwMC4zMzMzMyw2NC41aDE0LjMzMzMzdjc4LjgzMzMzaC0xNC4zMzMzM3oiPjwvcGF0aD48L2c+PC9nPjwvc3ZnPg==" />
                    </form>
                </counter_edit>
            </counter>
        )
    }
}

export default withRouter(Counter)
