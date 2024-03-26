import React, { useState } from "react";
import { Box, VStack, HStack, Text, Input, Button, Table, Thead, Tbody, Tr, Th, Td, TableContainer, FormControl, FormLabel } from "@chakra-ui/react";

const Index = () => {
  const [individuals, setIndividuals] = useState([]);
  const [name, setName] = useState("");
  const [allocation, setAllocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [duration, setDuration] = useState("");
  const [cliff, setCliff] = useState("");

  const handleAddIndividual = () => {
    const newIndividual = {
      name,
      allocation: parseInt(allocation),
      startDate,
      duration: parseInt(duration),
      cliff: parseInt(cliff),
    };
    setIndividuals([...individuals, newIndividual]);
    setName("");
    setAllocation("");
    setStartDate("");
    setDuration("");
    setCliff("");
  };

  const calculateVestedTokens = (individual) => {
    const { allocation, duration, cliff } = individual;
    const currentDate = new Date();
    const startDate = new Date(individual.startDate);
    const elapsedMonths = (currentDate - startDate) / (1000 * 60 * 60 * 24 * 30);

    if (elapsedMonths < cliff) {
      return 0;
    } else if (elapsedMonths >= duration) {
      return allocation;
    } else {
      const vestedPercentage = (elapsedMonths - cliff) / (duration - cliff);
      return Math.floor(allocation * vestedPercentage);
    }
  };

  const data = individuals.map((individual) => ({
    name: individual.name,
    vestedTokens: calculateVestedTokens(individual),
    remainingTokens: individual.allocation - calculateVestedTokens(individual),
  }));

  return (
    <Box p={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Vesting Dashboard
      </Text>
      <VStack spacing={4} align="stretch">
        <FormControl id="name">
          <FormLabel>Name</FormLabel>
          <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name" />
        </FormControl>
        <FormControl id="allocation">
          <FormLabel>Allocation</FormLabel>
          <Input type="number" value={allocation} onChange={(e) => setAllocation(e.target.value)} placeholder="Enter allocation" />
        </FormControl>
        <FormControl id="startDate">
          <FormLabel>Start Date</FormLabel>
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </FormControl>
        <FormControl id="duration">
          <FormLabel>Duration (months)</FormLabel>
          <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Enter duration" />
        </FormControl>
        <FormControl id="cliff">
          <FormLabel>Cliff (months)</FormLabel>
          <Input type="number" value={cliff} onChange={(e) => setCliff(e.target.value)} placeholder="Enter cliff" />
        </FormControl>
        <Button colorScheme="blue" onClick={handleAddIndividual}>
          Add Individual
        </Button>
      </VStack>
      <Box mt={8}>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Allocation</Th>
                <Th>Vested Tokens</Th>
              </Tr>
            </Thead>
            <Tbody>
              {individuals.map((individual, index) => (
                <Tr key={index}>
                  <Td>{individual.name}</Td>
                  <Td>{individual.allocation}</Td>
                  <Td>{calculateVestedTokens(individual)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Index;
