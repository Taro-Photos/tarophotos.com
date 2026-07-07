import { P, WorkLink } from "@taro/design-system";

// Journal 本文段落。既定は和字（明朝）、英文は lang="en"。
export const Japanese = () => (
  <div style={{ padding: 24, maxWidth: 680 }}>
    <P>
      撮ることの大半は、待つことでできている。三脚を立て、構図を決め、
      あとは光が来るのを待つ。
    </P>
  </div>
);

export const English = () => (
  <div style={{ padding: 24, maxWidth: 680 }}>
    <P lang="en">Most of photography is waiting; the shutter is an afterthought.</P>
  </div>
);

export const WithInlineLink = () => (
  <div style={{ padding: 24, maxWidth: 680 }}>
    <P>
      この朝のことは <WorkLink slug="first-light-voyage">First Light Voyage</WorkLink>{" "}
      としてまとめている。
    </P>
  </div>
);
