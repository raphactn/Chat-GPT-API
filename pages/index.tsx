import { ChatIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Container,
  Flex,
  Input,
  Text,
  useColorModeValue,
  InputRightElement,
  InputGroup,
  Divider,
  Button,
  Stack,
  useColorMode,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { OpenIA } from "../services/OpenIa";
import { RiSendPlane2Line } from "react-icons/ri";
import { GiArtificialIntelligence } from "react-icons/gi";
import styles from "../styles/main.module.css";

export default function Home({ data }: any) {
  const { colorMode, toggleColorMode } = useColorMode();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<string>("");
  const [res, setRes] = useState<any>([]);
  const router = useRouter();
  const bottom = useRef<any>();

  const scrollToBottom = () => {
    bottom.current?.scrollIntoView({
      block: "end",
      behavior: "instant",
    });
  };

  const handleSearch = () => {
    if (!value) {
      return;
    }
    setLoading(true);
    if (value === "clear") {
      setRes([]);
      router.replace({
        query: { text: null },
      });
      setValue("");
      return;
    }
    setRes([...res, { me: value }]);
    setTimeout(() => {
      scrollToBottom();
    }, 500);
    router.replace({
      query: { text: value },
    });
    router.replace({
      query: { text: null },
    });
    setValue("");
  };
  useEffect(() => {
    if (data.text) {
      setLoading(false);
      setRes([...res, { bot: data.text }]);
      setTimeout(() => {
        scrollToBottom();
      }, 500);
    }
  }, [data]);

  useEffect(() => {
    scrollToBottom();
  }, [loading]);

  return (
    <>
      <Head>
        <title>Chat GPT - API</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Center w="100%">
        <Flex
          bg={useColorModeValue("gray.100", "gray.900")}
          direction="column"
          w="100%"
          h="100vh"
          maxW="1000px"
          justifyContent="space-between"
        >
          <Flex align={"center"} gap={3} p={2} justifyContent="space-between">
            <Center>
              <GiArtificialIntelligence fontSize={"50px"} />
              <Text>Open IA</Text>
            </Center>
            <Flex alignItems={"center"}>
              <Stack direction={"row"} spacing={7}>
                <Button onClick={toggleColorMode}>
                  {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                </Button>
              </Stack>
            </Flex>
          </Flex>
          <Divider />
          <Box overflowY={"auto"} mb={2} h="100%" p={2}>
            {res.length > 0 ? (
              res.map((item: { bot: string; me: string }, i: number) => (
                <>
                  <Box
                    key={i}
                    bg={
                      item.bot
                        ? useColorModeValue("gray.200", "gray.800")
                        : useColorModeValue("gray.50", "gray.700")
                    }
                    w="max-content"
                    rounded={"md"}
                    p={3}
                    ml={item.me ? "auto" : "none"}
                    mb={4}
                    maxW="300"
                  >
                    {item.bot ? item.bot : item.me}
                  </Box>
                </>
              ))
            ) : (
              <Center gap={3} fontSize="2xl" h="100%">
                <Text>Ask something!</Text> <ChatIcon />
              </Center>
            )}
            {loading && res.length > 0 ? (
              <Box
                bg={useColorModeValue("gray.200", "gray.800")}
                w="max-content"
                rounded={"md"}
                p={3}
                mb={4}
                maxW="300"
                className={styles.typing}
              />
            ) : null}
            <div ref={bottom} />
          </Box>
          <Flex direction="column" p={2}>
            <InputGroup>
              <Input
                variant={"outline"}
                placeholder="Type here..."
                value={value}
                type="text"
                onKeyPress={(e) => {
                  if (e.code === "Enter") {
                    handleSearch();
                  }
                }}
                onChange={(e) => setValue(e.target.value)}
              />
              <InputRightElement>
                <RiSendPlane2Line
                  fontSize={"25px"}
                  cursor={"pointer"}
                  onClick={handleSearch}
                />
              </InputRightElement>
            </InputGroup>
          </Flex>
        </Flex>
      </Center>
    </>
  );
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const text = ctx.query.text;
  if (text) {
    const { data } = await OpenIA({ data: text });
    return {
      props: {
        data: data.choices[0],
      },
    };
  }
  return {
    props: {
      data: {},
    },
  };
};
