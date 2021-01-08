console.log("edx");

const parentChildPairs = [
  [2, 1],
  [4, 2],
  [3, 1],
  [5, 3],
  [8, 5],
  [6, 3],
  [9, 6],
  [12, 9],
  [10, 6],
  [13, 10],
  [10, 7],
  [11, 7],
  [14, 11],
  [15, 14],
];

const shareCommonAncestor = (relationships, person1, person2) => {
  const unique = (array) => Array.from(new Set(array));

  const everybody = unique(parentChildPairs.flat());

  let ancestors = {};
  everybody.forEach((person) => {
    ancestors[person] = [];
  });

  const getParents = (relationshipArray, person) => {
    let ret = [];
    relationshipArray.forEach(([parent, child]) => {
      if (child === Number(person)) ret.push(parent);
    });
    return ret;
  };

  let directParents = {};

  Object.entries(ancestors).forEach(([person, lineage]) => {
    directParents[person] = ancestors[person] = getParents(
      parentChildPairs,
      person
    );
  });

  const getAnotherLevel = () => {
    Object.entries(ancestors).forEach(([person, lineage]) => {
      console.log({ lineage });
      lineage.forEach((member) => {
        ancestors[person].push(...directParents[member]);
      });
    });
    Object.entries(ancestors).forEach(([person, lineage]) => {
      ancestors[person] = unique(lineage);
    });
  };

  getAnotherLevel();
  getAnotherLevel();

  console.log({ ancestors });
  return (
    ancestors[person1].filter((element) => ancestors[person2].includes(element))
      .length > 0
  );
};

console.log(shareCommonAncestor(parentChildPairs, 6, 7));
