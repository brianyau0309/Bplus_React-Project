import React from 'react'

import MemoContent from './MemoContent.jsx'
import MemoSide from './MemoSide.jsx'

export default class Memo extends React.Component {
    constructor (props) {
        super();
        this.state = {
            memoData: [],
            tag: '', content: '', created: '',
        }
    }
    render() {
        return (
        <memo>
            <input type="checkbox" id="sideToggle" />
            <memo_header>
                &nbsp;<label for="sideToggle" id="sideToggleLabel">&#9776;</label>
                <img id="pngMemo" alt="Memo" src="https://img.icons8.com/ios/50/000000/note.png" />
                &nbsp;Memo
            </memo_header>
            <MemoContent />
            <MemoSide />
        </memo>
        )
    }
}

