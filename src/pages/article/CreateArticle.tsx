import { useEffect, useState } from 'react';
import TextInput from '../../components/Input';
import { Notice, Error } from '../../components/Alerts';

import '../../scss/pages/create-article.scss';
import OAuth, { claims, now } from '../../oauth';

const ILP_API_URL = process.env.REACT_APP_ILP_API as string

interface baseFormInfo {
  title?: string
  category: string
  tags: string
  description?: string
  question?: string
  link?: string
}

const MetadataInput = (props: { menu: string | undefined }) => {

  useEffect(() => {
    let draft = localStorage.getItem("createArticleDraft")
    localStorage.removeItem("createArticleDraft")
    if (draft)
      submitArticle(null, JSON.parse(draft))
  }, [])

  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [formInfo, setFormInfo] = useState<baseFormInfo>({ category: "art", tags: "" })

  let form, heading;
  if (props.menu === 'websiteLink') {
    form = <WebsiteLinkMenu onChange={handleInputChange.bind(this)} />;
    heading = <h3>Linking To A Website</h3>;
  }
  else if (props.menu === 'websiteFiles') {
    form = null;
    heading = <h3>Uplaoding Website Files</h3>;
  }
  else if (props.menu === 'textEditor') {
    form = null;
    heading = <h3>Using the Text-Editor</h3>;
  }
  else {
    form = null;
    heading = <h1>Choose an option on the left</h1>;
  }

  function handleInputChange(event: any) {
    const name: 'title' | 'category' | 'tags' | 'description' = event.target.name;
    const value: string = event.target.value
    var newFormInfo = formInfo
    newFormInfo[name] = value
    setFormInfo(newFormInfo);
  }

  function submitArticle(event: React.FormEvent<HTMLFormElement> | null, data: baseFormInfo) {
    if (event) event.preventDefault()
    console.log(data)
    if (formInfo.title !== data.title) {
      setFormInfo(data)
    }

    let submissionData: any = data
    if (data.tags === "") submissionData.tags = []
    else if (typeof (data.tags as any) === 'string' || (data.tags as any) instanceof String) {
      let tags = data.tags.trim().split(",")
      for (let i = 0; i < tags.length; i++) {
        tags[i] = tags[i].trim()
      }
      submissionData.tags = tags
    }

    if (data.link) {
      let url = data.link
      if (url && !url.startsWith("http")) {
        url = "http://" + url
        submissionData.link = url
      }
    }

    submissionData.type = props.menu


    setLoading("Submitting Article")

    if (claims.exp < now()) {
      // Save draft

      localStorage.setItem("createArticleDraft", JSON.stringify(data))

      window.location.reload()
      return
    }

    const request_headers: Record<string, string> = {
      'Authorization': "Bearer " + localStorage.getItem("accessToken") as string,
      'Content-Type': 'application/json'
    }

    fetch(ILP_API_URL + "articles/create", {
      method: 'POST',
      headers: request_headers,
      body: JSON.stringify(data)
    })
      .then((response) => {
        if (response.status === 200)
          response.text().then((articleID) => {
            setLoading(null)
            window.location.href = `/article/modify/${articleID}`
          })
        else {
          response.text().then((text) => { setLoading(null); setError(text) })
        }
      })

  }



  if (loading)
    return <h1>{loading}</h1>

  let stuff = <>
    <input type='text' name='submissionType' value={props.menu} hidden readOnly />
    <br />

    <strong><span className="required"></span> indicates a required field</strong>

    <h4>Metadata</h4>

    <TextInput id='title' label='Title' defaultValue={formInfo.title} onChange={handleInputChange} required />
    <br />
    <br />

    <label htmlFor='category' className='required'>Category</label>
    <br />
    <div className='select-wrapper'>
      <select name='category' defaultValue={formInfo.category} id='category' onChange={handleInputChange} required>
        <option value='art'>Art</option>
        <option value='design'>Design</option>
        <option value='entrepreneurial'>Entrepreneurial</option>
        <option value='research'>Research</option>
        <option value='subjectSpecific'>Subject-Specific</option>
      </select>
    </div>
    <br />
    <br />

    <TextInput id='tags' label='Tags' defaultValue={formInfo.tags} onChange={handleInputChange} />
    <Notice>
      Tags must be separated by a comma
      (e.g. computer science<span className='highlighted'>,&nbsp;</span>algorithms)
    </Notice>
    <br />

    <label htmlFor="description" className='required'>Description (50-150 words)</label>
    <br />
    <textarea name="description" defaultValue={formInfo.description} id="description" onChange={handleInputChange} required></textarea>


    <h4>Content</h4>
    <TextInput id='question' label='Driving/Inquiry Question' defaultValue={formInfo.question} onChange={handleInputChange} required />
    <br />
    <br />

    {form}

    <input type='submit' value='Submit or die' />
  </>


  return (
    <form className='data' onSubmit={(event: React.FormEvent<HTMLFormElement>) => submitArticle(event, formInfo)}>
      {(error) ? <Error>{error}</Error> : null}
      {heading}
      {(props.menu) ? stuff : null}
    </form>
  )
}


const WebsiteLinkMenu = (props: { onChange: any }) => {
  return (
    <div>
      <TextInput id='link' label='Website Link' onChange={props.onChange} required />
      <Notice>
        Please enter the <em>published</em> link, not the link to the editor.
        Make sure you can access the link from an incognito/private tab or it won't work.
        For further support, please contact
        <a href='mailto:kaelan.carlos@education.nsw.gov.au'>kaelan.carlos@education.nsw.gov.au</a>
        or
        <a href='mailto:oggyp@oggyp.com'>oggyp@oggyp.com</a>
      </Notice>
      <br />
    </div>
  )
}


const ArticleCreate = () => {
  const [menu, setMenu] = useState<string | undefined>();

  return (
    <main id='main'>
      <OAuth>
        <h1 className='title'>Create A Project</h1>

        <p className='flex-row'>Before you create a project, you need to tell us some info about it.</p>

        <div id='article-wizard'>
          <div className='options'>
            <button
              className={(menu === 'websiteLink') ? 'selected' : ''}
              onClick={() => { setMenu('websiteLink') }}
            >
              <h2>Link To Website</h2>
              <p>
                For websites made with a website builder
                <br />
                (e.g. Weebly, Wix, Squarespace)
              </p>
            </button>

            <button
              className={(menu === 'websiteFiles') ? 'selected' : ''}
              onClick={() => { setMenu('websiteFiles') }}
              disabled
            >
              <h2>Upload Website</h2>
              <p>
                For websites made with from scratch with HTML, CSS, JS, etc.
                (Not fully implimented yet)
              </p>
            </button>

            <button
              className={(menu === 'textEditor') ? 'selected' : ''}
              onClick={() => { setMenu('textEditor') }}
            >
              <h2>Using the Text-Editor</h2>
              <p>
                For everything else
              </p>
            </button>
          </div>

          <MetadataInput menu={menu} />
        </div>
      </OAuth>
    </main>
  )
}


export default ArticleCreate;