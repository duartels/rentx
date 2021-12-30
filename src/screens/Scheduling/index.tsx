import React, { useState } from 'react';
import { Alert, StatusBar } from 'react-native';
import { useTheme } from 'styled-components';
import { format } from 'date-fns';
import {
  Container,
  Header,
  Title,
  RentalPeriod,
  DateInfo, 
  DateTitle,
  DateValueContainer,
  DateValue,
  Content,
  Footer,
} from './styles';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';

import { Button } from '../../components/Button';
import { 
  Calendar,
  DayProps, 
  generateInterval,
  MarkedDateProps
} from '../../components/Calendar';
import { BackButton } from '../../components/BackButton';

import ArrowSvg from '../../assets/arrow.svg';
import { getPlatformDate } from '../../utils/getPlatformDate';

interface RentalPeriod {
  start: number;
  startFormatted: string;
  end: number;
  endFormatted: string;
}

export function Scheduling(){
  const [lastSelectedDate, setLastSelectedDate] = useState<DayProps>({} as DayProps);
  const [markedDates, setMArkedDates] = useState<MarkedDateProps>({} as MarkedDateProps);
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod);

  const { navigate, goBack }: NavigationProp<ParamListBase> = useNavigation();
  const theme = useTheme();

  function handleConfirmRental(){
    if(!rentalPeriod.start || !rentalPeriod.start){
      Alert.alert('Selecione o intervalo para alugar');
    }else{
      navigate('SchedulingDetails');
    }
  }

  function handleBack(){
    goBack();
  }

  function handleChangeDate(date: DayProps) {
    let start = !lastSelectedDate.timestamp ? date : lastSelectedDate;
    let end = date;

    if(start.timestamp > end.timestamp) {
      start = end;
      end = start;
    }

    setLastSelectedDate(end);
    const interval = generateInterval(start, end);
    setMArkedDates(interval);

    const firstDate = Object.keys(interval)[0];
    const endDate = Object.keys(interval)[Object.keys(interval).length - 1];

    setRentalPeriod({
      start: start.timestamp,
      end: end.timestamp,
      startFormatted: format(getPlatformDate(new Date(firstDate)), 'dd/MM/yyyy'),
      endFormatted: format(getPlatformDate(new Date(endDate)), 'dd/MM/yyyy'),
    })
  }

  return (
    <Container>
      <StatusBar 
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <Header>
        <BackButton 
          color={theme.colors.shape}
          onPress={handleBack} 
        />

        <Title>
          Escolha uma {'\n'}
          data de ínicio e {'\n'}
          fim do aluguel
        </Title>

        <RentalPeriod>
          <DateInfo>
            <DateTitle>DE</DateTitle>
            <DateValueContainer selected={!!rentalPeriod.startFormatted}>
              <DateValue>
                {rentalPeriod.startFormatted}
              </DateValue>
            </DateValueContainer>
          </DateInfo>

          <ArrowSvg />

          <DateInfo>
            <DateTitle>ATÉ</DateTitle>
            <DateValueContainer selected={!!rentalPeriod.endFormatted}>
              <DateValue>
                {rentalPeriod.endFormatted}
              </DateValue>
            </DateValueContainer>
          </DateInfo>
        </RentalPeriod>

      </Header>

      <Content>
        <Calendar 
          markedDates={markedDates}
          onDayPress={handleChangeDate}
        />
      </Content>

      <Footer>
        <Button title='Confirmar' onPress={handleConfirmRental}/>
      </Footer>
    </Container>
  )
}