import { extendTheme, SystemStyleObject } from "@chakra-ui/react";

type CreateProps = Record<string, SystemStyleObject>;

export const Styles = {
  create: function <T extends CreateProps>(styles: T): T {
    return styles;
  },
};

export const theme = extendTheme({
  fonts: {
    body: `"Inter", sans-serif`,
    heading: `"Inter", sans-serif`,
  },
  components: {
    Button: {
      baseStyle: {
        lineHeight: 1,
      },
    },
  },
  styles: {
    global: {
      "html, body": {
        scrollBehavior: "smooth",
        backgroundColor: "#e2e8f0",
      },
      "textarea[data-fabric-hiddentextarea]": {
        position: "fixed !important",
      },
      "::-webkit-scrollbar": {
        width: 1.5,
        height: 1.5,
        background: "transparent",
      },
      "::-webkit-scrollbar-thumb": {
        background: "gray.400",
        borderRadius: 10,
      },
    },
  },
  sizes: {
    container: {
      "2xl": "1440px",
    },
  },
});
