import { useColorModeValue, Box } from '@chakra-ui/react'
import ReactMarkdown from 'react-markdown'
export default function MessageBox(props: { output: string }) {
  let { output } = props

  // TODO: Try mdxjs and see if that renders this better.  FIXIE has some odd things...
  let citationRegex = /<Citation title="(.*)" href="(.*)" \/>/g
  let citationMatch = citationRegex.exec(output)
  if (citationMatch) {
    let title = citationMatch[1]
    let href = citationMatch[2]
    output = output.replace(citationRegex, `\n\nSource: [${title}](${href})`)
  }

  console.log({ output })
  const textColor = useColorModeValue('navy.700', 'white')
  // lets add some code to chagne how a links and citations are rendered
  return (
    <Box
      //display={output ? 'flex' : 'none'}
      //px="22px !important"
      //pl="22px !important"
      color={textColor}
      // minH="450px"
      fontSize={{ base: 'sm', md: 'md' }}
      lineHeight={{ base: '24px', md: '26px' }}
      fontWeight="500"

    >
      <ReactMarkdown
        components={{
          // lets handle a tags and Citation tags
          a: ({ node, ...props }) => {
            // if the link it to youtube, lets embed it
            if (props.href.includes('youtube')) {
              // the link needs to be rewritten to be an embed link
              // https://www.youtube.com/watch?v=2Vv-BfVoq4g
              // becomes
              // https://www.youtube.com/embed/2Vv-BfVoq4g
              let link = props.href
              let url = new URL(link)
              let embedLink = url.href.replace('watch?v=', 'embed/')
              props.href = embedLink
              return (
                <div>
                  <a href={props.href} target="_blank">{props.children} Open in Youtube</a>
                <iframe
                  width="560"
                  height="315"
                  src={props.href}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
                </div>
              )
            }
            return (
              <a
                {...props}
                target='_blank'
                style={{
                  color: 'blue',
                  textDecoration: 'underline',
                }}
              >
                {props.children}
              </a>
            )
          },
        }}
      >
        {output ? output : ''}
      </ReactMarkdown>
    </Box>
  )
}
