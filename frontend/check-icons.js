const icons = require('lucide-react');
const keys = Object.keys(icons);
const toCheck = ['PersonStanding', 'MemoryStick', 'Cpu', 'Zap', 'PersonStanding'];
toCheck.forEach(name => {
  console.log(name + ': ' + (keys.includes(name) ? 'EXISTS' : 'MISSING'));
});
// Also find close alternatives
console.log('\nPerson alternatives:', keys.filter(k => k.toLowerCase().includes('person') && !k.includes('Icon') && !k.includes('Lucide')).join(', '));
console.log('\nMemory alternatives:', keys.filter(k => k.toLowerCase().includes('memory') && !k.includes('Icon') && !k.includes('Lucide')).join(', '));
