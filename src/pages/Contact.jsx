import { useState } from "react";
import { generateLead } from "../analytics/events";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [topic, setTopic] = useState("Wholesale");
  const submit = e => { e.preventDefault(); generateLead("contact_form", topic); setSent(true); };

  if (sent) return <section className="section narrow"><h1 className="h1">Message sent</h1><p>We'd reply within a day if this were a real shop.</p></section>;
  return (
    <section className="section narrow">
      <h1 className="h1">Contact us</h1>
      <form className="form" onSubmit={submit}>
        <label>Topic<select value={topic} onChange={e => setTopic(e.target.value)}>
          <option>Wholesale</option><option>Order help</option><option>Gifting</option></select></label>
        <label>Email<input required type="email" /></label>
        <label>Message<textarea required rows={4} /></label>
        <button className="btn solid">Send message</button>
      </form>
    </section>
  );
}
