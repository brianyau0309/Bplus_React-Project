import React from 'react'

function MemoList (props) {
    const citem = props.memoData.map(ctr => (
        <memoItem key={ctr._id} memo={ctr} />
    ));
    return (
        <table className="memo_list">{citem}</table>
    )
}

function ListItem (props) {
    const tdWidth = {
        width: '10%'
    }
    return (
        <Link to={`/memo/${props.memo._id}`}>
            <tr>
                <td style={tdWidth}>
                    &nbsp;&nbsp;
                    &nbsp;&nbsp;
                    <span id={`mark${props.memo._id}`}></span>
                    &nbsp;&nbsp;
                </td>
                <td>{props.memo.title}</td>
            </tr>   
        </Link>
    )//`
}

export default class MemoSide extends React.Component {
    constructor(props){
        super();
    }     
    render() {
        return (
            <memo_side>
                <h3>Memo List</h3>
            </memo_side>

        )
    }
}
