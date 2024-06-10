import {Component} from 'react'
import Loader from 'react-loader-spinner'

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import ProjectShowCase from './components/ProjectShowCase'

import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

// Replace your code here
class App extends Component {
  state = {
    data: [],
    selectItem: 'ALL',
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const {selectItem} = this.state
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${selectItem}`
    const options = {
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    console.log(response)
    if (response.ok) {
      const data = await response.json()
      const updateData = data.projects.map(eachData => ({
        id: eachData.id,
        name: eachData.name,
        imageUrl: eachData.image_url,
      }))

      this.setState({
        data: updateData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  selectItemList = event => {
    this.setState({selectItem: event.target.value}, this.getData)
  }

  renderLoadingView = () => (
    <div className="loading-container" data-testid="loader">
      <Loader type="ThreeDots" color="#00BFFF" width={50} height={50} />
    </div>
  )

  renderProjectShowCaseView = () => {
    const {data} = this.state

    return (
      <div className="project-container">
        <ul className="project-list">
          {data.map(eachProject => (
            <ProjectShowCase key={eachProject.id} details={eachProject} />
          ))}
        </ul>
      </div>
    )
  }

  renderFilureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" className="retry-button" onClick={this.getData}>
        Retry
      </button>
    </div>
  )

  renderProjectVi = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProjectShowCaseView()
      case apiStatusConstants.failure:
        return this.renderFilureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {selectItem} = this.state
    return (
      <nav className="nav-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
          alt="website logo"
          className="logo"
        />

        <div className="main-container">
          <ul className="select-list">
            <select
              className="select-input"
              value={selectItem}
              onChange={this.selectItemList}
            >
              {categoriesList.map(eachItem => (
                <option value={eachItem.id} key={eachItem.id}>
                  {eachItem.displayText}
                </option>
              ))}
            </select>
          </ul>
        </div>
        {this.renderProjectVi()}
      </nav>
    )
  }
}

export default App
