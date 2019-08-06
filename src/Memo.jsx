import React from 'react'

function CounterList (props) {
    const citem = props.counterData.map(ctr => (
        <CounterItem key={ctr._id} counter={ctr} />
    ));
    console.log(citem)
    return (
        <table>
            <thead>
                <tr>
                    <td>Head</td>
                </tr>
            </thead>
            <tbody>{citem}</tbody>
        </table>
    )
}
function IssueTable (props) {
	const issueRows = props.issues.map(issue => <CounterItem
		key={issue._id} issue={issue} />);
	return(
		<table className="bordered-table">
			<thead>
				<tr>
					<th>Id</th>
					<th>Status</th>
					<th>Owner</th>
					<th>Created</th>
					<th>Effort</th>
					<th>Completion Date</th>
					<th>Title</th>
				</tr>
			</thead>
			<tbody>{issueRows}</tbody>
		</table>
	);
}
const CounterItem = (props) => (
    <tr>
        <td>title: {props.issue.title}</td>
    </tr>    
)
const IssueRow = (props) => (
	<tr>
		<td>{props.issue.title}</td>
	</tr>
)

export default class Memo extends React.Component {
    constructor (props) {
        super();
        this.state = { issues: [{'_id': 123, 'title': 'title 1'},] }
        this.addNewCounter = this.addNewCounter.bind(this)
    }
    addNewCounter(e) {
		e.preventDefault();
        let form = document.forms.test
        let data = { 'title': 'form.title.value' }
        fetch(`/api/counters`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(res => { 
            if (res.ok) {
                res.json().then(newCounter => {
                     console.log(newCounter);
                })
            } else {
                res.json().then(err => alert(`Failed to Add: ${err.message}`))
            }
        }).catch(err => alert(`Error on submit: ${err.message}`));
    }
    render() {
        return (
        <div>
            
            Memo Page
            <form id="test" onSubmit={ this.addNewCounter }>
            <button type="submit">123</button>
            </form>
            <IssueTable issues={this.state.issues} />

        </div>
        )
    }
}

