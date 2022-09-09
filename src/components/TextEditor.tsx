// @ts-nocheck
import {Editor, EditorState, RichUtils, getDefaultKeyBinding, AtomicBlockUtils, convertFromHTML, ContentState} from 'draft-js';
import React from 'react';
import { stateToHTML } from "draft-js-export-html";
import GoogleIcon from './Icons';

class TextEditor extends React.Component {
  constructor(props) {
    super(props);

    let baseEditorState = (this.props.defaultValue)? this.props.defaultValue: '<p></p>';
    this.state = {
      editorState: EditorState.createWithContent(
        ContentState.createFromBlockArray(
          convertFromHTML(baseEditorState)
        )
      )
    };

    this.focus = () => this.refs.editor.focus();
    this.onChange = (editorState) => {
      this.setState({
        editorState
      });
      this.props.htmlGetter(stateToHTML(editorState.getCurrentContent()))
    };

    this.handleKeyCommand = this._handleKeyCommand.bind(this);
    this.mapKeyToEditorCommand = this._mapKeyToEditorCommand.bind(this);
    this.toggleBlockType = this._toggleBlockType.bind(this);
    this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
  }

  _handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  _mapKeyToEditorCommand(e) {
    if (e.keyCode === 9 /* TAB */) {
      const newEditorState = RichUtils.onTab(
        e,
        this.state.editorState,
        4, /* maxDepth */
      );
      if (newEditorState !== this.state.editorState) {
        this.onChange(newEditorState);
      }
      return;
    }
    return getDefaultKeyBinding(e);
  }

  _toggleBlockType(blockType) {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }

  render() {
    const { editorState } = this.state;

    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = 'RichEditor-editor';
    var contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
      }
    }

    return (
      <div className="RichEditor-root">
        <div className="controls">
          <BlockStyleControls
            editorState={editorState}
            onToggle={this.toggleBlockType}
          />
          <InlineStyleControls
            editorState={editorState}
            onToggle={this.toggleInlineStyle}
          />
          {/* <InsertStyleControls
            editorState={editorState}
            setEditor={(newEditor) => {{editorState: newEditor}}}
          /> */}
        </div>
        <div id='text-editor' className={className + ' paper'} onClick={this.focus}>
          <Editor
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            keyBindingFn={this.mapKeyToEditorCommand}
            onChange={this.onChange}
            ref="editor"
            spellCheck={true}
          />
        </div>
      </div>
    );
  }
}

// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote': return 'RichEditor-blockquote';
    default: return null;
  }
}

class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {
    let className = 'RichEditor-styleButton';
    if (this.props.active) {
      className += ' RichEditor-activeButton';
    }

    return (
      <span className={className} onMouseDown={this.onToggle} title={this.props.title}>
        {this.props.label}
      </span>
    );
  }
}

const BLOCK_TYPES = [
  {label: 'H1', style: 'header-one', name: 'Heading 1'},
  {label: 'H2', style: 'header-two', name: 'Heading 2'},
  {label: 'H3', style: 'header-three', name: 'Heading 3'},
  {label: 'H4', style: 'header-four', name: 'Heading 4'},
  {label: <GoogleIcon name='format_quote' />, style: 'blockquote', name: 'Quote'},
  {label: <GoogleIcon name='format_list_bulleted' />, style: 'unordered-list-item', name: 'Bulleted List'},
  {label: <GoogleIcon name='format_list_numbered' />, style: 'ordered-list-item', name: 'Numbered List'},
  {label: <GoogleIcon name='code' />, style: 'code-block', name: 'Code'},
];

const BlockStyleControls = (props) => {
  const {editorState} = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map((type) =>
        <StyleButton
          key={type.style}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
          title={type.name}
        />
      )}
    </div>
  );
};

var INLINE_STYLES = [
  {label: <strong>B</strong>, style: 'BOLD', name: 'Bold'},
  {label: <em>I</em>, style: 'ITALIC', name: 'Italics'},
  {label: <u>U</u>, style: 'UNDERLINE', name: 'Underline'},
];

const InlineStyleControls = (props) => {
  const currentStyle = props.editorState.getCurrentInlineStyle();
  
  return (
    <div className="RichEditor-controls basic">
      {INLINE_STYLES.map((type) =>
        <StyleButton
          key={type.style}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
          title={type.name}
        />
      )}
    </div>
  );
};

const insertImage = (editorState, url = 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9f/Australian_Defence_Force_Academy_coat_of_arms.svg/1200px-Australian_Defence_Force_Academy_coat_of_arms.svg.png') => {
  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity(
          'IMAGE',
          'IMMUTABLE',
          { src: url },)
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const newEditorState = EditorState.set( editorState, { currentContent: contentStateWithEntity });
  return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ');
};

const INSERT_STYLES = [
  {label: <GoogleIcon name='image' />, function: insertImage, name: 'Insert Image'}
]

const InsertStyleControls = (props) => {
  const currentStyle = props.editorState;

  return (
    <div className='RichEditor-controls insert'>
      {INSERT_STYLES.map((type) =>
        <span
          className='RichEditor-styleButton'
          onMouseDown={() => {
            props.setEditor(type.function(currentStyle))
          }} 
          title={type.name}
        >
          {type.label}
        </span>
      )}
    </div>
  )
}

export default TextEditor;