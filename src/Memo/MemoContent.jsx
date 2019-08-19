import React from 'react'

export default class MemoContent extends React.Component {
    constructor(props){
        super();
    }     
    render() {
        return (
            <memo_content>
               <h3>Memo Content</h3>
                <form>
                    <div>Tags:</div>
                    <input id="memoTags" type="text" maxlength="30" />
                    <div>Content:</div>
                    <textarea id="memoText"></textarea>
                </form>
            </memo_content>
        )
    }
}
