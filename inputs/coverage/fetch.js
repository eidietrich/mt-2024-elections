const fs = require('fs')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const writeJson = (path, data) => {
    fs.writeFile(path, JSON.stringify(data, null, 2), err => {
        if (err) throw err
        console.log('JSON written to', path)
    }
    );
}

const TAG = "tracker-2022-campaign" // Replace spaces in tag as seen in CMS with hyphens here
const EXCLUDE_TAG = 'Tracker Exclude'
const QUERY_LIMIT = 100
const OUT_PATH = './inputs/coverage/articles.json'

async function getStories(cursor) {

    const stories = fetch('https://montanafreepress.org/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
            {
            posts(after: "${cursor}",first: ${QUERY_LIMIT}, where: {tag: "${TAG}"}) {
                pageInfo {
                    hasPreviousPage
                    hasNextPage
                    startCursor
                    endCursor
                }
                nodes {
                    title
                    date
                    link
                    status
                    tags(first: 100) {
                      nodes {
                        name
                      }
                    }
                    categories(first: 100) {
                      nodes {
                        name
                      }
                    }
                    featuredImage {
                      node {
                        link
                      }
                    }
                    author {
                      node {
                        name
                      }
                    }
                    excerpt
                  }
            }
        }
        `,
        }),
    })
        .then(res => res.json())
        .then(json => json.data)
        .catch(err => console.log(err))

    return stories
}

async function main() {
    let stories = []
    let hasNextPage = true
    let cursor = ""
    while (hasNextPage) {
        const query = await getStories(cursor)
        stories = stories.concat(query.posts.nodes)
        cursor = query.posts.pageInfo.endCursor
        hasNextPage = query.posts.pageInfo.hasNextPage
    }
    const filtered = stories.filter(d => !d.tags.nodes.map(t => t.name).includes(EXCLUDE_TAG))
    console.log(`Found ${stories.length} MTFP stories tagged ${TAG}`)
    console.log(`Returned ${filtered.length} excluding tag ${EXCLUDE_TAG}`)

    writeJson(OUT_PATH, filtered)
    console.log('MTFP articles fetch done\n')
}
main()