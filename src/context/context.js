import React, { useState, useEffect } from 'react'
import mockUser from './mockData.js/mockUser'
import mockRepos from './mockData.js/mockRepos'
import mockFollowers from './mockData.js/mockFollowers'
import axios from 'axios'

const rootUrl = 'https://api.github.com'

const GithubContext = React.createContext()

// Provider, Consumer - GithubContext.Provider

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser)
  const [repos, setRepos] = useState(mockRepos)
  const [followers, setFollwers] = useState(mockFollowers)

  // request loading
  const [requests, setRequests] = useState(0)
  const [loading, setisLoading] = useState(false)
  const [error, setError] = useState({ show: false, mesg: '' })

  const searchGithubUser = async (user) => {
    toggleError()
    // setLoading(true)
    const response = await axios(`${rootUrl}/users/${user}`).catch((err) =>
      console.log(err)
    )
    console.log(response)
    if (response) {
      setGithubUser(response.data)
      // more logic
    } else {
      toggleError(true, 'there is no user with that username')
    }
  }
  // check rate
  const checkRequests = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        let {
          rate: { remaining },
        } = data
        setRequests(remaining)
        if (remaining === 0) {
          toggleError(true, 'you have exceeded 60 allowable requests per hour')
        }
      })
      .catch((err) => console.log(err))
  }

  function toggleError(show = false, msg = '') {
    setError({ show, msg })
  }
  // error

  useEffect(checkRequests, [])

  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        requests,
        error,
        searchGithubUser,
      }}
    >
      {children}
    </GithubContext.Provider>
  )
}

export { GithubProvider, GithubContext }
