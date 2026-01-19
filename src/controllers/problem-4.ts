import { Request, Response } from "express";

type ImplementationReturnType = {
  cons: string[];
  pros: string[];
  spaceComplexity: "O(n)" | "O(1)";
  sum: number;
  timeComplexity: "O(n)" | "O(1)";
  title: string;
};

function implementationA(n: number): ImplementationReturnType {
  let sum = 0;

  for (let i = 1; i <= n; i++) sum += i;

  return {
    cons: [`inefficient for very large "n" because it loops "n" times`],
    pros: ["Very readable and beginner-friendly", "Easy to debug"],
    spaceComplexity: "O(1)",
    sum,
    timeComplexity: "O(n)",
    title: "Iterative Loop",
  };
}

function implementationB(n: number): ImplementationReturnType {
  const sum = (n * (n + 1)) / 2;

  return {
    cons: [
      "Requires knowing the formula",
      `Slightly less "obvious" at first glance`,
    ],
    pros: ["Fastest possible solution", "No loops, constant time"],
    spaceComplexity: "O(1)",
    sum,
    timeComplexity: "O(1)",
    title: "Mathematical Formula",
  };
}

function implementationC(n: number): number {
  if (n <= 1) return n;
  return n + implementationC(n - 1);
}

export const implementations = (req: Request, res: Response): void => {
  const { num } = req.params;

  if (!num || (num && Number.isNaN(+num))) {
    res.status(400).json({
      success: false,
      message: "Num is undefined or num is not a number!",
    });
    return;
  }

  const impA = implementationA(+num);
  const impB = implementationB(+num);
  const impC = implementationC(+num);

  res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Home</title>
        <style>
         .title {
          font-weight: 600;
         }
        </style>
      </head>
      <body>
        <h1>Problem 4</h1>
        <div style="display:flex;flex-direction:row;gap:8px">
        <div>
          <h3>Implementation A</h3>
          <div style="padding:2px;background-color: grey; color: white;font-size:20px">
          function sum_to_n_a(n: number): number {
  let sum = 0;

  for (let i = 1; i <= n; i++) {
    sum += i;
  }

  return sum;
}
          </div>
          <p><span class="title">Result</span>: ${impA.sum.toString()}</p>
          <p><span class="title">Time Complexity</span>: ${impA.timeComplexity}</p>
          <p><span class="title">Space Complexity</span>: ${impA.spaceComplexity}</p>
          <p><span class="title">Pros</span>:</p>
          ${impA.pros.map((item) => `<p>- ${item}</p>`).join("\n")}
          <p><span class="title">Cons</span>:</p>
          ${impA.cons.map((item) => `<p>- ${item}</p>`).join("\n")}
          </div>
          <div>
          <h3>Implementation B</h3>
          <div style="padding:2px;background-color: grey; color: white;font-size:20px">
          function sum_to_n_b(n: number): number {
  return (n * (n + 1)) / 2;
}
          </div>
          <p><span class="title">Result</span>: ${impB.sum.toString()}</p>
          <p><span class="title">Time Complexity</span>: ${impB.timeComplexity}</p>
          <p><span class="title">Space Complexity</span>: ${impB.spaceComplexity}</p>
          <p><span class="title">Pros</span>:</p>
          ${impB.pros.map((item) => `<p>- ${item}</p>`).join("\n")}
          <p><span class="title">Cons</span>:</p>
          ${impB.cons.map((item) => `<p>- ${item}</p>`).join("\n")}
          </div>
          <div>
          <h3>Implementation C</h3>
          <div style="padding:2px;background-color: grey; color: white;font-size:20px">
          function sum_to_n_c(n: number): number {
  if (n <= 1) return n;
  return n + sum_to_n_c(n - 1);
}
          </div>
          <p><span class="title">Result</span>: ${impC.toString()}</p>
          <p><span class="title">Time Complexity</span>: O(n)</p>
          <p><span class="title">Space Complexity</span>: O(n)</p>
          <p><span class="title">Pros</span>:</p>
          ${["Elegent and expressive", "Good for understanding recursion"].map((item) => `<p>- ${item}</p>`).join("\n")}
          <p><span class="title">Cons:</p>
          ${[`Risk of stack overflow for large "n"`, "Less efficient than the loop version"].map((item) => `<p>- ${item}</p>`).join("\n")}
        </div>
          </div>
      </body>
    </html>
  `);
};
