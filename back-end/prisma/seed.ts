import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding MCQ questions and Interview Question Bank...');

  // ─── MCQ Questions ─────────────────────────────────────────────────────────

  const mcqQuestions = [
    // ── Web Developer ──
    {
      role: Role.WebDeveloper, category: 'JavaScript',
      question: 'Which method is used to add an element to the end of an array in JavaScript?',
      optionA: 'push()', optionB: 'pop()', optionC: 'shift()', optionD: 'unshift()',
      correctAnswer: 'A',
      explanation: 'push() adds one or more elements to the end of an array and returns the new length.',
    },
    {
      role: Role.WebDeveloper, category: 'React',
      question: 'What hook would you use to run a side-effect after every render in React?',
      optionA: 'useState', optionB: 'useMemo', optionC: 'useEffect', optionD: 'useCallback',
      correctAnswer: 'C',
      explanation: 'useEffect runs after every render by default. You can control it with a dependency array.',
    },
    {
      role: Role.WebDeveloper, category: 'CSS',
      question: 'What CSS property is used to make a flex container wrap its children onto multiple lines?',
      optionA: 'flex-direction: wrap', optionB: 'flex-wrap: wrap', optionC: 'align-items: wrap', optionD: 'display: wrap',
      correctAnswer: 'B',
      explanation: 'flex-wrap: wrap tells a flex container to allow items to wrap onto the next line.',
    },
    {
      role: Role.WebDeveloper, category: 'JavaScript',
      question: 'What does the === operator check in JavaScript?',
      optionA: 'Value only', optionB: 'Type only', optionC: 'Both value and type', optionD: 'Object reference',
      correctAnswer: 'C',
      explanation: '=== is the strict equality operator — it checks both value AND type without coercion.',
    },
    {
      role: Role.WebDeveloper, category: 'HTTP',
      question: 'Which HTTP status code means "Resource Not Found"?',
      optionA: '200', optionB: '301', optionC: '404', optionD: '500',
      correctAnswer: 'C',
      explanation: '404 is returned when the server cannot find the requested resource.',
    },
    {
      role: Role.WebDeveloper, category: 'React',
      question: 'What is the purpose of the key prop in React lists?',
      optionA: 'To style list items', optionB: 'To help React identify which items changed', optionC: 'To assign CSS class names', optionD: 'To set element IDs',
      correctAnswer: 'B',
      explanation: 'Keys help React identify which items have changed, been added, or removed for efficient re-renders.',
    },
    {
      role: Role.WebDeveloper, category: 'JavaScript',
      question: 'What is a closure in JavaScript?',
      optionA: 'A way to close the browser window', optionB: 'A function that has access to its outer scope even after the outer function has returned', optionC: 'A method to terminate loops', optionD: 'A CSS animation technique',
      correctAnswer: 'B',
      explanation: 'A closure is a function that remembers variables from its lexical scope even when called outside that scope.',
    },
    {
      role: Role.WebDeveloper, category: 'NodeJS',
      question: 'Which module in Node.js is used to create an HTTP server?',
      optionA: 'fs', optionB: 'path', optionC: 'http', optionD: 'os',
      correctAnswer: 'C',
      explanation: 'The built-in http module provides utilities for creating HTTP servers and clients.',
    },
    {
      role: Role.WebDeveloper, category: 'HTML',
      question: 'Which HTML5 element is used to define navigation links?',
      optionA: '<menu>', optionB: '<nav>', optionC: '<header>', optionD: '<section>',
      correctAnswer: 'B',
      explanation: '<nav> is a semantic HTML5 element specifically designed to define a set of navigation links.',
    },
    {
      role: Role.WebDeveloper, category: 'JavaScript',
      question: 'What does Promise.all() do?',
      optionA: 'Runs promises sequentially', optionB: 'Returns the first resolved promise', optionC: 'Runs all promises in parallel and resolves when all complete', optionD: 'Cancels all pending promises',
      correctAnswer: 'C',
      explanation: 'Promise.all() takes an array of promises and resolves when all of them have resolved, or rejects if any rejects.',
    },

    // ── Data Analyst ──
    {
      role: Role.DataAnalyst, category: 'SQL',
      question: 'Which SQL clause is used to filter rows after a GROUP BY operation?',
      optionA: 'WHERE', optionB: 'HAVING', optionC: 'FILTER', optionD: 'LIMIT',
      correctAnswer: 'B',
      explanation: 'HAVING filters groups after aggregation, while WHERE filters rows before aggregation.',
    },
    {
      role: Role.DataAnalyst, category: 'Python',
      question: 'Which pandas method returns the first 5 rows of a DataFrame?',
      optionA: 'df.top()', optionB: 'df.first()', optionC: 'df.head()', optionD: 'df.show()',
      correctAnswer: 'C',
      explanation: 'df.head(n) returns the first n rows of a DataFrame (default n=5).',
    },
    {
      role: Role.DataAnalyst, category: 'Statistics',
      question: 'What does a p-value less than 0.05 typically indicate?',
      optionA: 'The null hypothesis is true', optionB: 'The result is statistically significant', optionC: 'The sample size is too small', optionD: 'There is no correlation',
      correctAnswer: 'B',
      explanation: 'A p-value < 0.05 means there is less than 5% probability the result occurred by chance — statistically significant.',
    },
    {
      role: Role.DataAnalyst, category: 'SQL',
      question: 'What is the difference between INNER JOIN and LEFT JOIN?',
      optionA: 'They are identical', optionB: 'LEFT JOIN returns all rows from the left table, INNER JOIN returns only matching rows', optionC: 'INNER JOIN is faster in all cases', optionD: 'LEFT JOIN only works with NULL values',
      correctAnswer: 'B',
      explanation: 'INNER JOIN returns matching rows from both tables. LEFT JOIN returns ALL rows from the left table plus matching rows from the right.',
    },
    {
      role: Role.DataAnalyst, category: 'Python',
      question: 'Which pandas function is used to handle missing values by filling them?',
      optionA: 'df.replace()', optionB: 'df.dropna()', optionC: 'df.fillna()', optionD: 'df.clean()',
      correctAnswer: 'C',
      explanation: 'df.fillna(value) fills NaN values with a specified value, forward fill, or backward fill.',
    },
    {
      role: Role.DataAnalyst, category: 'Visualization',
      question: 'Which chart type is best for showing the distribution of a continuous variable?',
      optionA: 'Bar chart', optionB: 'Pie chart', optionC: 'Histogram', optionD: 'Line chart',
      correctAnswer: 'C',
      explanation: 'A histogram shows the frequency distribution of a continuous variable by dividing it into bins.',
    },
    {
      role: Role.DataAnalyst, category: 'SQL',
      question: 'What does the DISTINCT keyword do in SQL?',
      optionA: 'Sorts results alphabetically', optionB: 'Removes duplicate rows from the result', optionC: 'Returns only NULL values', optionD: 'Filters by primary key',
      correctAnswer: 'B',
      explanation: 'SELECT DISTINCT eliminates duplicate rows from the query result set.',
    },
    {
      role: Role.DataAnalyst, category: 'Statistics',
      question: 'What is the median of the dataset [3, 7, 5, 2, 8]?',
      optionA: '5', optionB: '6', optionC: '7', optionD: '4',
      correctAnswer: 'A',
      explanation: 'Sorted: [2, 3, 5, 7, 8]. The middle value is 5.',
    },
    {
      role: Role.DataAnalyst, category: 'Python',
      question: 'Which NumPy function creates an array of zeros?',
      optionA: 'np.empty()', optionB: 'np.blank()', optionC: 'np.zeros()', optionD: 'np.null()',
      correctAnswer: 'C',
      explanation: 'np.zeros(shape) creates an array of the given shape filled with zeros.',
    },
    {
      role: Role.DataAnalyst, category: 'SQL',
      question: 'What does the COUNT(*) function return?',
      optionA: 'Sum of all numeric values', optionB: 'Number of rows including NULLs', optionC: 'Number of non-NULL values only', optionD: 'Average row count',
      correctAnswer: 'B',
      explanation: 'COUNT(*) counts all rows in a group including those with NULL values.',
    },

    // ── Application Developer ──
    {
      role: Role.ApplicationDeveloper, category: 'Flutter',
      question: 'What is a Widget in Flutter?',
      optionA: 'A database table', optionB: 'The basic building block of the Flutter UI', optionC: 'A REST API client', optionD: 'A navigation class',
      correctAnswer: 'B',
      explanation: 'In Flutter, everything is a Widget — from layout elements to buttons to text.',
    },
    {
      role: Role.ApplicationDeveloper, category: 'Dart',
      question: 'Which keyword is used to declare an asynchronous function in Dart?',
      optionA: 'async', optionB: 'await', optionC: 'future', optionD: 'defer',
      correctAnswer: 'A',
      explanation: 'The async keyword marks a function as asynchronous, enabling use of await inside it.',
    },
    {
      role: Role.ApplicationDeveloper, category: 'Mobile',
      question: 'What is the difference between StatelessWidget and StatefulWidget in Flutter?',
      optionA: 'StatelessWidget cannot have child widgets', optionB: 'StatefulWidget has mutable state that can be updated, StatelessWidget cannot change', optionC: 'StatelessWidget is faster but deprecated', optionD: 'There is no practical difference',
      correctAnswer: 'B',
      explanation: 'StatefulWidget maintains mutable state via a State object. StatelessWidget renders once and never changes.',
    },
    {
      role: Role.ApplicationDeveloper, category: 'Android',
      question: 'In Android development, what is an Intent?',
      optionA: 'A UI component', optionB: 'A messaging object used to request an action from another component', optionC: 'A database query', optionD: 'A layout file',
      correctAnswer: 'B',
      explanation: 'An Intent is an abstract description of an operation to be performed, used to start activities, services, or send broadcasts.',
    },
    {
      role: Role.ApplicationDeveloper, category: 'iOS',
      question: 'Which programming language is primarily used for iOS development?',
      optionA: 'Kotlin', optionB: 'Java', optionC: 'Swift', optionD: 'Go',
      correctAnswer: 'C',
      explanation: 'Swift is Apple\'s primary programming language for iOS, macOS, watchOS, and tvOS development.',
    },
    {
      role: Role.ApplicationDeveloper, category: 'Flutter',
      question: 'What does the pubspec.yaml file do in a Flutter project?',
      optionA: 'Defines the app\'s UI layout', optionB: 'Manages project dependencies and assets', optionC: 'Configures network requests', optionD: 'Stores database schemas',
      correctAnswer: 'B',
      explanation: 'pubspec.yaml is the package manifest file — it lists dependencies, assets, and project metadata.',
    },
    {
      role: Role.ApplicationDeveloper, category: 'Architecture',
      question: 'What pattern does MVVM stand for?',
      optionA: 'Model-View-ViewModel', optionB: 'Module-View-Validation-Manager', optionC: 'Model-Variable-View-Method', optionD: 'Multi-View-Versioned-Model',
      correctAnswer: 'A',
      explanation: 'MVVM (Model-View-ViewModel) separates UI (View) from business logic (ViewModel) and data (Model).',
    },
    {
      role: Role.ApplicationDeveloper, category: 'React Native',
      question: 'What is the equivalent of a <div> in React Native?',
      optionA: '<Container>', optionB: '<Box>', optionC: '<View>', optionD: '<Block>',
      correctAnswer: 'C',
      explanation: '<View> is the fundamental container component in React Native, similar to <div> in HTML.',
    },
    {
      role: Role.ApplicationDeveloper, category: 'Mobile',
      question: 'What does API rate limiting mean in mobile app development?',
      optionA: 'Limiting the size of API responses', optionB: 'Restricting the number of requests a client can make in a time period', optionC: 'Caching API results locally', optionD: 'Using GraphQL instead of REST',
      correctAnswer: 'B',
      explanation: 'Rate limiting controls how often a client can call an API endpoint, preventing abuse and ensuring fair usage.',
    },
    {
      role: Role.ApplicationDeveloper, category: 'Flutter',
      question: 'Which Flutter widget is used for scrollable lists?',
      optionA: 'Column', optionB: 'GridView', optionC: 'ListView', optionD: 'Stack',
      correctAnswer: 'C',
      explanation: 'ListView is a scrollable list of widgets. Use ListView.builder for long or infinite lists.',
    },

    // ── Cloud Engineer ──
    {
      role: Role.CloudEngineer, category: 'AWS',
      question: 'What is Amazon S3 primarily used for?',
      optionA: 'Running virtual machines', optionB: 'Object storage for files and data', optionC: 'DNS management', optionD: 'Database hosting',
      correctAnswer: 'B',
      explanation: 'Amazon S3 (Simple Storage Service) is an object storage service for storing any amount of data.',
    },
    {
      role: Role.CloudEngineer, category: 'Docker',
      question: 'What does a Dockerfile define?',
      optionA: 'Network routing rules', optionB: 'The steps to build a Docker image', optionC: 'Container runtime configuration', optionD: 'Kubernetes pod specs',
      correctAnswer: 'B',
      explanation: 'A Dockerfile is a text document with instructions for building a Docker image layer by layer.',
    },
    {
      role: Role.CloudEngineer, category: 'Kubernetes',
      question: 'What is a Kubernetes Pod?',
      optionA: 'A physical server', optionB: 'A collection of containers that share network and storage', optionC: 'A load balancer', optionD: 'A CI/CD pipeline step',
      correctAnswer: 'B',
      explanation: 'A Pod is the smallest deployable unit in Kubernetes — it groups one or more containers that share resources.',
    },
    {
      role: Role.CloudEngineer, category: 'AWS',
      question: 'Which AWS service is used for auto-scaling and load balancing compute resources?',
      optionA: 'AWS Lambda', optionB: 'Amazon RDS', optionC: 'Amazon EC2 Auto Scaling', optionD: 'Amazon Route 53',
      correctAnswer: 'C',
      explanation: 'EC2 Auto Scaling automatically adjusts capacity to maintain performance and minimize costs.',
    },
    {
      role: Role.CloudEngineer, category: 'Terraform',
      question: 'What is Infrastructure as Code (IaC)?',
      optionA: 'Writing application code on cloud servers', optionB: 'Managing and provisioning infrastructure through machine-readable config files', optionC: 'Monitoring cloud resource performance', optionD: 'Converting legacy apps to cloud-native',
      correctAnswer: 'B',
      explanation: 'IaC lets you manage infrastructure (networks, VMs, databases) using version-controlled configuration files like Terraform HCL.',
    },
    {
      role: Role.CloudEngineer, category: 'Docker',
      question: 'What is the purpose of docker-compose?',
      optionA: 'To write Dockerfiles automatically', optionB: 'To define and run multi-container Docker applications', optionC: 'To push images to Docker Hub', optionD: 'To monitor container CPU usage',
      correctAnswer: 'B',
      explanation: 'docker-compose uses a YAML file to configure and start multiple containers with a single command.',
    },
    {
      role: Role.CloudEngineer, category: 'Networking',
      question: 'What does a VPC (Virtual Private Cloud) provide in AWS?',
      optionA: 'A virtual desktop environment', optionB: 'An isolated section of the AWS cloud with your own network', optionC: 'A private CDN for static assets', optionD: 'A managed Kubernetes service',
      correctAnswer: 'B',
      explanation: 'A VPC provides an isolated virtual network where you control IP ranges, subnets, routing, and security.',
    },
    {
      role: Role.CloudEngineer, category: 'CI/CD',
      question: 'What is the difference between Continuous Integration and Continuous Deployment?',
      optionA: 'They are the same concept', optionB: 'CI automates code merging and testing; CD automates the release to production', optionC: 'CD is only for databases', optionD: 'CI requires manual approval gates',
      correctAnswer: 'B',
      explanation: 'CI focuses on automatically merging and testing code. CD extends CI by automatically deploying to staging/production.',
    },
    {
      role: Role.CloudEngineer, category: 'AWS',
      question: 'What is AWS Lambda?',
      optionA: 'A container orchestration service', optionB: 'A serverless compute service that runs code without provisioning servers', optionC: 'A message queuing service', optionD: 'A DNS routing service',
      correctAnswer: 'B',
      explanation: 'AWS Lambda lets you run code without managing servers — you pay only for the compute time consumed.',
    },
    {
      role: Role.CloudEngineer, category: 'Kubernetes',
      question: 'What command deploys an application in Kubernetes?',
      optionA: 'kubectl run', optionB: 'kubectl apply -f', optionC: 'kubectl push', optionD: 'kubectl start',
      correctAnswer: 'B',
      explanation: 'kubectl apply -f <file.yaml> creates or updates Kubernetes resources defined in a manifest file.',
    },

    // ── Cybersecurity Analyst ──
    {
      role: Role.CybersecurityAnalyst, category: 'Network Security',
      question: 'What does a firewall do?',
      optionA: 'Encrypts disk data', optionB: 'Monitors and controls incoming and outgoing network traffic based on rules', optionC: 'Prevents hardware failure', optionD: 'Manages user authentication',
      correctAnswer: 'B',
      explanation: 'A firewall is a network security system that monitors and controls traffic based on predefined security rules.',
    },
    {
      role: Role.CybersecurityAnalyst, category: 'Threats',
      question: 'What is a SQL Injection attack?',
      optionA: 'Injecting malicious SQL into a database server hardware', optionB: 'Inserting malicious SQL code into input fields to manipulate a database', optionC: 'A DoS attack targeting database servers', optionD: 'Stealing SQL server admin credentials',
      correctAnswer: 'B',
      explanation: 'SQL injection exploits unsanitized input fields to insert SQL that manipulates the backend database.',
    },
    {
      role: Role.CybersecurityAnalyst, category: 'Cryptography',
      question: 'What is the main difference between symmetric and asymmetric encryption?',
      optionA: 'Symmetric uses two keys, asymmetric uses one', optionB: 'Symmetric uses one shared key, asymmetric uses a public/private key pair', optionC: 'Asymmetric is always faster', optionD: 'Symmetric encryption cannot be used for data at rest',
      correctAnswer: 'B',
      explanation: 'Symmetric encryption uses the same key to encrypt/decrypt. Asymmetric uses public key to encrypt, private key to decrypt.',
    },
    {
      role: Role.CybersecurityAnalyst, category: 'Network Security',
      question: 'What is a Man-in-the-Middle (MITM) attack?',
      optionA: 'An attack on the physical server hardware', optionB: 'When an attacker secretly intercepts and relays communication between two parties', optionC: 'A social engineering attack via phone', optionD: 'A DDoS attack method',
      correctAnswer: 'B',
      explanation: 'In a MITM attack, the attacker positions themselves between client and server to intercept or alter communications.',
    },
    {
      role: Role.CybersecurityAnalyst, category: 'Linux',
      question: 'Which Linux command shows active network connections?',
      optionA: 'ifconfig', optionB: 'netstat -an', optionC: 'ls -la', optionD: 'ps aux',
      correctAnswer: 'B',
      explanation: 'netstat -an displays all active connections and listening ports with their addresses and states.',
    },
    {
      role: Role.CybersecurityAnalyst, category: 'Threats',
      question: 'What is phishing?',
      optionA: 'A network scanning technique', optionB: 'A social engineering attack using deceptive emails or websites to steal credentials', optionC: 'A method to exploit buffer overflows', optionD: 'Port scanning for vulnerabilities',
      correctAnswer: 'B',
      explanation: 'Phishing tricks users into revealing sensitive information by impersonating trusted entities.',
    },
    {
      role: Role.CybersecurityAnalyst, category: 'Cryptography',
      question: 'What is the purpose of a hash function in security?',
      optionA: 'To encrypt data bidirectionally', optionB: 'To produce a fixed-size fingerprint of data that cannot be reversed', optionC: 'To generate public/private key pairs', optionD: 'To compress large files',
      correctAnswer: 'B',
      explanation: 'Hash functions are one-way — they produce a unique digest of data but cannot be reversed to recover the original.',
    },
    {
      role: Role.CybersecurityAnalyst, category: 'Penetration Testing',
      question: 'What is the purpose of a penetration test?',
      optionA: 'To install security patches automatically', optionB: 'To simulate real attacks to find vulnerabilities before malicious actors do', optionC: 'To monitor network traffic in real time', optionD: 'To back up sensitive data',
      correctAnswer: 'B',
      explanation: 'Penetration testing (pen testing) is authorized simulated cyberattacks to find and fix vulnerabilities.',
    },
    {
      role: Role.CybersecurityAnalyst, category: 'Network Security',
      question: 'What does HTTPS provide over HTTP?',
      optionA: 'Faster page load speeds', optionB: 'Encrypted communication using SSL/TLS', optionC: 'Server-side rendering', optionD: 'Automatic data compression',
      correctAnswer: 'B',
      explanation: 'HTTPS encrypts communication between client and server using SSL/TLS, preventing eavesdropping and tampering.',
    },
    {
      role: Role.CybersecurityAnalyst, category: 'Threats',
      question: 'What is a zero-day vulnerability?',
      optionA: 'A bug that only exists for one day', optionB: 'A vulnerability unknown to the vendor with no available patch', optionC: 'A virus that deletes all files at midnight', optionD: 'A false positive in a security scanner',
      correctAnswer: 'B',
      explanation: 'A zero-day is an undisclosed vulnerability that vendors don\'t know about yet — giving attackers a head start.',
    },

    // ── Machine Learning Engineer ──
    {
      role: Role.MachineLearningEngineer, category: 'ML Fundamentals',
      question: 'What is overfitting in machine learning?',
      optionA: 'When a model is too simple to capture patterns', optionB: 'When a model learns the training data too well including noise, and generalizes poorly', optionC: 'When a model runs out of memory during training', optionD: 'When training data is too small',
      correctAnswer: 'B',
      explanation: 'Overfitting occurs when a model memorizes training data (including noise) and fails to generalize to unseen data.',
    },
    {
      role: Role.MachineLearningEngineer, category: 'Deep Learning',
      question: 'What is the activation function that solves the vanishing gradient problem in deep networks?',
      optionA: 'Sigmoid', optionB: 'Tanh', optionC: 'ReLU', optionD: 'Softmax',
      correctAnswer: 'C',
      explanation: 'ReLU (Rectified Linear Unit) outputs max(0, x) and avoids the vanishing gradient problem that Sigmoid and Tanh suffer from.',
    },
    {
      role: Role.MachineLearningEngineer, category: 'ML Fundamentals',
      question: 'What is the purpose of cross-validation?',
      optionA: 'To validate the model architecture design', optionB: 'To estimate how well a model generalizes to an independent dataset', optionC: 'To speed up model training', optionD: 'To compare different datasets',
      correctAnswer: 'B',
      explanation: 'Cross-validation (e.g., k-fold) helps estimate model performance on unseen data by training/testing on different splits.',
    },
    {
      role: Role.MachineLearningEngineer, category: 'Python',
      question: 'Which library provides the train_test_split function?',
      optionA: 'TensorFlow', optionB: 'NumPy', optionC: 'scikit-learn', optionD: 'Pandas',
      correctAnswer: 'C',
      explanation: 'scikit-learn\'s model_selection module provides train_test_split to split data into training and test sets.',
    },
    {
      role: Role.MachineLearningEngineer, category: 'Algorithms',
      question: 'What type of algorithm is K-Means clustering?',
      optionA: 'Supervised learning', optionB: 'Reinforcement learning', optionC: 'Unsupervised learning', optionD: 'Semi-supervised learning',
      correctAnswer: 'C',
      explanation: 'K-Means is an unsupervised learning algorithm — it finds natural groupings in unlabeled data.',
    },
    {
      role: Role.MachineLearningEngineer, category: 'Deep Learning',
      question: 'What is backpropagation?',
      optionA: 'A method to augment training data', optionB: 'An algorithm that computes gradients and propagates error backward through a neural network', optionC: 'A technique to skip layers in deep networks', optionD: 'A regularization method',
      correctAnswer: 'B',
      explanation: 'Backpropagation calculates the gradient of the loss with respect to each weight by the chain rule, enabling weight updates.',
    },
    {
      role: Role.MachineLearningEngineer, category: 'ML Fundamentals',
      question: 'What metric is most appropriate for evaluating a classification model on an imbalanced dataset?',
      optionA: 'Accuracy', optionB: 'F1-Score', optionC: 'Mean Squared Error', optionD: 'R² Score',
      correctAnswer: 'B',
      explanation: 'F1-Score balances precision and recall, making it ideal for imbalanced datasets where accuracy is misleading.',
    },
    {
      role: Role.MachineLearningEngineer, category: 'PyTorch',
      question: 'What does model.eval() do in PyTorch?',
      optionA: 'Evaluates the model\'s accuracy', optionB: 'Sets the model to training mode', optionC: 'Sets the model to evaluation mode, disabling dropout and batch norm', optionD: 'Prints the model architecture',
      correctAnswer: 'C',
      explanation: 'model.eval() switches off training-specific behaviors like dropout and batch normalization for inference.',
    },
    {
      role: Role.MachineLearningEngineer, category: 'Algorithms',
      question: 'What is a Random Forest?',
      optionA: 'A single decision tree with random features', optionB: 'An ensemble of decision trees that uses bagging and feature randomness', optionC: 'A neural network with random initialization', optionD: 'A clustering algorithm',
      correctAnswer: 'B',
      explanation: 'Random Forest builds multiple decision trees on random data subsets and averages their predictions — reducing overfitting.',
    },
    {
      role: Role.MachineLearningEngineer, category: 'Deep Learning',
      question: 'What is transfer learning?',
      optionA: 'Moving a model from one server to another', optionB: 'Reusing a pre-trained model on a new, related task', optionC: 'Transferring data between training and test sets', optionD: 'Converting a model from PyTorch to TensorFlow',
      correctAnswer: 'B',
      explanation: 'Transfer learning leverages knowledge from a model trained on a large dataset (e.g., ImageNet) and fine-tunes it for a specific task.',
    },
  ];

  await prisma.mcqQuestion.createMany({ data: mcqQuestions, skipDuplicates: true });
  console.log(`✅ Seeded ${mcqQuestions.length} MCQ questions`);

  // ─── Interview Question Bank ────────────────────────────────────────────────

  const interviewQuestions = [
    // ── Behavioral (all roles get these) ──
    { role: Role.WebDeveloper, category: 'Behavioral', difficulty: 'Easy', question: 'Tell me about yourself.', answer: 'Structure your answer with: 1) Your current role/skills, 2) Past experience highlights, 3) Why you\'re excited about this opportunity. Keep it to 90 seconds. Example: "I\'m a web developer with 2 years of experience building React applications at [Company]. I\'m particularly strong in frontend performance optimization and have reduced load times by 40% in my last project. I\'m excited about this role because..."' },
    { role: Role.WebDeveloper, category: 'Behavioral', difficulty: 'Medium', question: 'Describe a time you faced a challenging technical problem. How did you solve it?', answer: 'Use the STAR method: Situation (brief context), Task (your responsibility), Action (specific steps you took — be technical!), Result (measurable outcome). Example: "We had a React app rendering 3000 list items causing jank. I profiled it with Chrome DevTools, identified unnecessary re-renders, implemented React.memo and virtual scrolling, reducing render time from 800ms to 50ms."' },
    { role: Role.WebDeveloper, category: 'Behavioral', difficulty: 'Medium', question: 'How do you handle disagreements with a teammate about technical decisions?', answer: 'Show maturity and data-driven thinking: 1) Listen fully to their perspective, 2) Articulate your concerns with technical reasoning, 3) Suggest a small proof-of-concept or benchmarking to let data decide, 4) Escalate to a tech lead with full context if still unresolved. Emphasize team goals over personal ego.' },
    { role: Role.WebDeveloper, category: 'Behavioral', difficulty: 'Hard', question: 'Tell me about a time you had to deliver under a tight deadline. What trade-offs did you make?', answer: 'Be honest about trade-offs while showing engineering maturity. Structure: Describe the deadline context → What you prioritized (core user flows vs edge cases) → What you consciously deferred (tests, refactoring, docs) → How you communicated this to stakeholders → What you did post-launch to address tech debt. Interviewers respect honesty about real-world engineering decisions.' },
    // Technical - Web
    { role: Role.WebDeveloper, category: 'Technical', difficulty: 'Easy', question: 'What is the difference between localStorage and sessionStorage?', answer: 'Both are Web Storage APIs but differ in persistence: localStorage persists across browser sessions (no expiry), sessionStorage is cleared when the tab/window is closed. Both store key-value strings (max ~5MB). Use localStorage for user preferences, sessionStorage for temporary session data. Neither is secure for sensitive data — use HTTP-only cookies instead.' },
    { role: Role.WebDeveloper, category: 'Technical', difficulty: 'Medium', question: 'Explain the React component lifecycle (hooks equivalent).', answer: 'Mounting: useEffect(() => { /* componentDidMount */ }, []) runs once after first render. Updating: useEffect(() => { /* componentDidUpdate */ }, [dependency]) runs when dependency changes. Unmounting: useEffect(() => { return () => { /* componentWillUnmount cleanup */ } }, []). Key insight: The cleanup function in useEffect prevents memory leaks from subscriptions, timers, or event listeners.' },
    { role: Role.WebDeveloper, category: 'Technical', difficulty: 'Hard', question: 'How would you optimize a React app that is rendering slowly?', answer: '1. Profile first with React DevTools Profiler — identify which components re-render unnecessarily. 2. Add React.memo to pure components. 3. Use useMemo for expensive calculations, useCallback to memoize handlers. 4. Implement code splitting with React.lazy + Suspense. 5. Use virtualization (react-window) for long lists. 6. Optimize images (lazy loading, WebP format). 7. Check for prop drilling causing wide re-renders — consider Context or Zustand.' },
    { role: Role.WebDeveloper, category: 'System Design', difficulty: 'Hard', question: 'How would you design a real-time collaborative document editor (like Google Docs)?', answer: 'Key components: 1) WebSocket server for real-time bi-directional communication, 2) Operational Transformation (OT) or CRDT algorithm to handle concurrent edits without conflict, 3) Document state versioned and stored in PostgreSQL, 4) Redis for active session state and pub/sub between multiple server instances, 5) CDN for static assets. Handle offline mode with local queuing and sync on reconnect. Show awareness of consistency vs availability trade-off.' },

    // ── Data Analyst ──
    { role: Role.DataAnalyst, category: 'Behavioral', difficulty: 'Easy', question: 'Tell me about yourself.', answer: 'Highlight: 1) Your analytical background and tools (SQL, Python, Tableau), 2) A specific insight you uncovered that drove business value, 3) Your interest in this role. Example: "I\'m a data analyst with experience in Python and SQL, where I built dashboards that identified a 15% revenue drop from a specific customer segment, leading to a targeted campaign that recovered it."' },
    { role: Role.DataAnalyst, category: 'Technical', difficulty: 'Medium', question: 'How would you handle missing data in a dataset?', answer: 'Strategy depends on missingness type: 1) MCAR (Missing Completely At Random) — safe to drop rows or impute with mean/median. 2) MAR (Missing At Random) — use conditional imputation based on related columns. 3) MNAR (Not At Random) — investigate root cause; imputing may introduce bias. Methods: Mean/median imputation (numeric), mode imputation (categorical), KNN imputation, or model-based (MICE). Always document your choice and its business impact.' },
    { role: Role.DataAnalyst, category: 'Technical', difficulty: 'Hard', question: 'Write a SQL query to find the top 3 customers by revenue in each region.', answer: 'Use a window function: SELECT region, customer_id, revenue FROM (SELECT region, customer_id, SUM(amount) AS revenue, ROW_NUMBER() OVER (PARTITION BY region ORDER BY SUM(amount) DESC) AS rn FROM orders GROUP BY region, customer_id) ranked WHERE rn <= 3; Key concepts: PARTITION BY groups within regions, ROW_NUMBER assigns rank, filter in outer query. Mention RANK() vs ROW_NUMBER() difference (ties).' },
    { role: Role.DataAnalyst, category: 'System Design', difficulty: 'Hard', question: 'How would you design a dashboard to monitor business KPIs in real time?', answer: '1) Data sources: transactional DB, event streams (Kafka), third-party APIs. 2) ETL/ELT pipeline: Apache Airflow for orchestration, dbt for transformations. 3) Data warehouse: Snowflake or BigQuery for analytical queries. 4) Visualization: Tableau/Grafana connected to warehouse. 5) Alerting: threshold-based alerts via PagerDuty/Slack. 6) Caching: pre-aggregate common queries. Discuss trade-off: real-time accuracy vs query cost.' },

    // ── Cloud Engineer ──
    { role: Role.CloudEngineer, category: 'Behavioral', difficulty: 'Easy', question: 'Tell me about yourself.', answer: 'Focus on: 1) Cloud platforms you\'ve worked with (AWS/GCP/Azure), 2) A specific infrastructure improvement (cost reduction, availability improvement), 3) Your passion for DevOps/Cloud. Example: "I\'m a cloud engineer who\'s provisioned and maintained AWS infrastructure serving 50K+ users. I reduced our monthly AWS bill by 30% by identifying idle resources and implementing auto-scaling policies."' },
    { role: Role.CloudEngineer, category: 'Technical', difficulty: 'Medium', question: 'How does Kubernetes handle container failures?', answer: 'Kubernetes has multiple self-healing mechanisms: 1) Liveness Probe: if the container fails the health check, Kubernetes restarts it. 2) Readiness Probe: removes the pod from load balancer if it\'s not ready to serve traffic. 3) ReplicaSet: ensures the desired number of pod replicas are always running. 4) Pod restart policies (Always, OnFailure, Never). 5) Node failure: the scheduler reschedules pods to healthy nodes automatically.' },
    { role: Role.CloudEngineer, category: 'System Design', difficulty: 'Hard', question: 'How would you design a highly available, fault-tolerant architecture for a web application on AWS?', answer: 'Multi-AZ deployment: 1) ELB Application Load Balancer distributes traffic. 2) EC2 in Auto Scaling Group across 3 AZs. 3) RDS Multi-AZ with read replicas. 4) ElastiCache (Redis) for session and caching layer. 5) S3 for static assets + CloudFront CDN. 6) Route 53 with health checks for DNS failover. 7) VPC with public/private subnets, NAT Gateway, Security Groups. Target: 99.99% availability SLA.' },

    // ── Cybersecurity Analyst ──
    { role: Role.CybersecurityAnalyst, category: 'Technical', difficulty: 'Medium', question: 'Walk me through your response process when a security incident is detected.', answer: 'Follow the PICERL framework: 1) Preparation: SIEM configured, playbooks ready. 2) Identification: alerts triage, determine if real incident. 3) Containment: isolate affected systems (network segmentation). 4) Eradication: remove malware, patch vulnerabilities. 5) Recovery: restore from clean backups, monitor for re-infection. 6) Lessons Learned: post-incident report, update detection rules. Always preserve evidence with forensic imaging before containment.' },
    { role: Role.CybersecurityAnalyst, category: 'Technical', difficulty: 'Hard', question: 'How does TLS/SSL work at a high level?', answer: 'TLS Handshake: 1) Client sends ClientHello (supported cipher suites, TLS version, random). 2) Server responds with ServerHello (chosen cipher, certificate). 3) Client verifies certificate against trusted CA. 4) Key exchange (ECDHE): both derive a shared session key without transmitting it. 5) Both send "Finished" using derived keys to confirm handshake. 6) Symmetric encryption begins. Key insight: Asymmetric crypto establishes a symmetric session key; all data uses symmetric (AES) for speed.' },

    // ── Machine Learning Engineer ──
    { role: Role.MachineLearningEngineer, category: 'Technical', difficulty: 'Medium', question: 'How do you prevent overfitting in a neural network?', answer: '1) Dropout: randomly disable neurons during training (e.g., 20-50%). 2) L1/L2 Regularization: penalize large weights in the loss function. 3) Early stopping: stop training when validation loss starts increasing. 4) Data augmentation: artificially expand training data. 5) Reduce model complexity: fewer layers/neurons. 6) Batch normalization: normalizes layer inputs, acts as regularizer. 7) Increase training data. Always monitor train vs. validation loss curves.' },
    { role: Role.MachineLearningEngineer, category: 'System Design', difficulty: 'Hard', question: 'How would you design an ML pipeline for a recommendation system?', answer: '1) Data collection: user events (clicks, views, purchases) via Kafka streaming. 2) Feature store: pre-computed user/item embeddings in Redis. 3) Model training: collaborative filtering (ALS) or neural CF, retrained daily with Airflow. 4) Serving: model server (TorchServe/TF Serving) with <50ms latency SLA. 5) A/B testing: split traffic between model versions. 6) Monitoring: track CTR, coverage, diversity. 7) Fallback: popularity-based ranking if model is unavailable.' },
  ];

  await prisma.interviewQuestion.createMany({ data: interviewQuestions, skipDuplicates: true });
  console.log(`✅ Seeded ${interviewQuestions.length} interview questions`);

  console.log('🌱 Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
