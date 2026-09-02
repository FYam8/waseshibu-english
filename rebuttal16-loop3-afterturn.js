(()=>{
const after = {
  "lrb01": "B: I see. Reducing the amount instead of removing homework completely might help students review without becoming too tired.",
  "lrb02": "B: That sounds reasonable. If schools make clear rules and students can use phones only for study or emergencies, the problems I mentioned might be reduced.",
  "lrb03": "B: I understand. If the preparation time is controlled, school events may support study rather than just take time away from it.",
  "lrb04": "B: That makes sense. Using tablets and printed books for different purposes may be better than replacing every book at once.",
  "lrb05": "B: I see. If clubs are managed carefully, they might help students grow without hurting their studies.",
  "lrb06": "B: I see. A few choices for students with special needs could work as long as the lunch system does not become too complicated.",
  "lrb07": "B: That is a good point. Maybe the town should solve the parking problem without losing one of the few places where people can relax.",
  "lrb08": "B: I understand. Improving the uniform design might solve the problems better than letting everyone wear anything they want.",
  "lrb09": "B: You may be right. Translation AI is useful, but it may not replace everything people learn from studying a language themselves.",
  "lrb10": "B: I see. I did not think much about the benefit you mentioned. Maybe improving zoos is better than closing all of them.",
  "lrb11": "B: Hmm, that is a good point. If cleaning teaches responsibility and helps the school save money, it may not be just extra work.",
  "lrb12": "B: That might work. Using online lessons only for review or special situations may be better than replacing ordinary classes.",
  "lrb13": "B: I understand. Maybe part-time jobs are useful for some students, but schools should be careful about study time and health.",
  "lrb14": "B: That is fair. Recognizing effort as well as top scores might motivate more students without making prizes meaningless.",
  "lrb15": "B: I see. Safety is important, but students may not feel comfortable if cameras are used without careful rules.",
  "lrb16": "B: That makes sense. Giving students some choices while keeping important basic subjects may be safer than complete freedom."
};
const eight = ["【語数】","【設問条件】","【良い点】","【優先修正点】","【文法・語法】","【最小限修正版】","【高得点答案例】","【合格戦略上の評価】"];
for (const q of window.DRILLS || []) {
  if (!q || q.retired || q.skill !== "rebuttal" || !after[q.id]) continue;
  const line = after[q.id];
  if (!q.prompt.includes("\n" + line)) {
    q.prompt = q.prompt.replace(/\nA: \(\s+\)\s*$/, "\nA: (                              )\n" + line);
  }
  q.postBlankResponse = line;
  q.auditNote = (q.auditNote || "") + " rebuttal16-loop3: added post-blank response to match 2024-2026 dialogue structure.";
  if (typeof q.explanation === "string" && !q.explanation.includes("【後続発言】")) {
    q.explanation += "\n【後続発言】空所後の相手の反応に自然につながるように、反論は条件付きの解決策や別視点を入れる。";
  }
  // Preserve all previous 8 essay explanation headings.
  for (const label of eight) {
    if (typeof q.explanation === "string" && !q.explanation.includes(label)) {
      q.explanation += "\n" + label + " 要確認。";
    }
  }
}
})();
