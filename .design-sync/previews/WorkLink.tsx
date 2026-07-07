import { P, WorkLink } from "@taro/design-system";

// 本文中から作品（/works/<slug>）へのリンク。作品集について書くときに使う。
export const InParagraph = () => (
  <div style={{ padding: 24, maxWidth: 680 }}>
    <P>
      この朝の写真は <WorkLink slug="first-light-voyage">First Light Voyage</WorkLink>{" "}
      に収めた。
    </P>
  </div>
);
